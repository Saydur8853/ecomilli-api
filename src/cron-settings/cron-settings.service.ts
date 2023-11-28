import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Prisma, CronSetting } from '@prisma/client';
import { CustomResponse } from 'src/shared/responses/CustomResponse';
import { DatabaseService } from 'src/database/database.service';
import { CreateCronSettingsDto } from './dto/create-cron-settings.dto';
import { UpdateCronSettingsDto } from './dto/update-cron-settings.dto';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import axios from 'axios';
import { cronJobSchedules } from 'src/utils/constants';



@Injectable()
export class CronSettingsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private schedulerRegistry: SchedulerRegistry
  ) { }
  private readonly logger = new Logger(CronSettingsService.name);

  async addCronJob(createCronSettingsDto: CreateCronSettingsDto, user: Express.User) {
    try {
      const { title, job, scheduleId, timeZone = "America/Los_Angeles" } = createCronSettingsDto;
      const reqUSer = user as RequestUser;

      const isExists = await this.databaseService.cronSetting.findFirst({
        where: {
          OR: [
            { title: { equals: title } },
            { job: { equals: job } }
          ]
        }
      });

      if (isExists) {
        return new CustomResponse(false, "CronSettings Already Exists.", {});
      } else {
        const schedule = cronJobSchedules.find((item) => item.id === scheduleId);
        const cronTitle = title.toLowerCase().replace(/ /g, '_');

        const cronJob = new CronJob(schedule.value, () => this.cronJobAPIFetching(cronTitle, job), null, false, timeZone);

        this.schedulerRegistry.addCronJob(cronTitle, cronJob);
        cronJob.start();

        this.logger.log(
          `job ${title} added for at ${schedule.label}!`,
        );

        const savedCron = await this.databaseService.cronSetting.create({
          data: {
            title,
            cronTitle,
            job,
            schedule: schedule,
            timeZone,
            cronAddedBy: {
              connect: {
                id: reqUSer.id
              }
            }
          }
        });

        return new CustomResponse<CronSetting>(true, "Cron Job Successfully Saved.", savedCron);
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }


  async findAlljobs(page: number, limit: number, query: string) {
    try {
      const skip = (page - 1) * limit;
      const totalRecord = await this.databaseService.cronSetting.count({
        where: {
          title: {
            contains: query
          }
        },
      });

      if (!totalRecord) return new CustomResponse(false, "CronSettings Not Found.", {});

      let whereQuery: Prisma.CronSettingWhereInput = {};

      if (query) {
        whereQuery = {
          title: { contains: query }
        };
      }

      const response = await this.databaseService.cronSetting.findMany({
        where: whereQuery,
        skip,
        take: limit
      });

      const metaData: MetaData = { currentpage: page, limit, totalPages: response.length, totalRecord };
      return new CustomResponse<CronSetting[]>(true, "CronSettings List Found.", response, metaData);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findOne(id: number) {
    try {
      const response = await this.databaseService.cronSetting.findUnique({
        where: {
          id
        }
      });

      if (!response) return new CustomResponse(false, "CronSettings Not Found.", {});

      return new CustomResponse(true, "CronSettings Found.", {});
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: number, updateCronSettingsDto: UpdateCronSettingsDto) {
    try {
      const isExists = await this.databaseService.cronSetting.findUnique({
        where: {
          id
        }
      });

      if (!isExists) {
        return new CustomResponse(false, "CronSettings Not Found.", {});
      } else {
        // Deleting Existing Cron Job
        this.schedulerRegistry.deleteCronJob(isExists.cronTitle);
        const { title, job, scheduleId, timeZone = "America/Los_Angeles" } = updateCronSettingsDto;

        // Creating a New Cron Job
        const schedule = cronJobSchedules.find((item) => item.id === scheduleId);
        const cronTitle = title.toLowerCase().replace(/ /g, '_');

        const cronJob = new CronJob(schedule.value, () => this.cronJobAPIFetching(cronTitle, job), null, false, timeZone);

        this.schedulerRegistry.addCronJob(cronTitle, cronJob);
        cronJob.start();

        this.logger.log(`job ${title} added for at ${schedule.label}!`,);


        await this.databaseService.cronSetting.update({
          where: { id },
          data: {
            title,
            cronTitle,
            job,
            schedule: schedule,
            timeZone
          }
        });
        return new CustomResponse(true, "CronSettings Successfuly Updated.", {});
      }

    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number) {
    try {
      const isExists = await this.databaseService.cronSetting.findUnique({
        where: {
          id
        }
      });

      if (!isExists) {
        return new CustomResponse(false, "CronSettings Not Found.", {});
      }
      else {
        // Deleting Cron Job
        this.schedulerRegistry.deleteCronJob(isExists.cronTitle);

        await this.databaseService.cronSetting.delete({
          where: { id },
        });

        return new CustomResponse(true, "CronSettings Successfuly Deleted.", {});
      }

    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }




  // Helpers 
  async cronJobAPIFetching(title: string, url?: string) {
    try {
      this.logger.log(`Job ${title} is running!`);
      // Make API call using Axios
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      this.logger.log(`API call result: ${response.data?.title}`);
    } catch (error) {
      this.logger.error(`Error making API call: ${error.message}`);
    }
  }






}
