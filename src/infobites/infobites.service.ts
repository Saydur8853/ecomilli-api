import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma, Infobite } from '@prisma/client';
import { CustomResponse } from 'src/shared/responses/CustomResponse';
import { DatabaseService } from 'src/database/database.service';
import { CreateInfobiteDto } from './dto/create-infobite.dto';
import { UpdateInfobiteDto } from './dto/update-infobite.dto';
import { StatusUpdate } from 'src/shared/dto/status-update.dto';



@Injectable()
export class InfobitesService {
  constructor(private readonly databaseService: DatabaseService) { }

  async create(createInfobiteDto: CreateInfobiteDto, filename: string, user: Express.User) {
    try {
      const reqUser = user as RequestUser;

      const isExists = await this.databaseService.infobite.findFirst({
        where: {
          title: {
            equals: createInfobiteDto.title
          }
        }
      });

      if (isExists) return new CustomResponse(false, "Infobite Already Exists.", {});


      const response = await this.databaseService.infobite.create({
        data: {
          title: createInfobiteDto.title,
          picture: filename,
          updatedById: reqUser?.id
        }
      });

      if (!response) return new CustomResponse(false, "Infobite Not Saved.", {});

      return new CustomResponse(true, "Infobite Successfuly Saved.", {});

    } catch (error) {
      throw new InternalServerErrorException();
    }

  }

  async findAll(page: number, limit: number, query: string) {
    try {
      const skip = (page - 1) * limit;
      const totalRecord = await this.databaseService.infobite.count({
        where: {
          title: {
            contains: query
          }
        },
      });

      if (!totalRecord) return new CustomResponse(false, "Infobite Not Found.", {});

      let whereQuery: Prisma.InfobiteWhereInput = {};

      if (query) {
        whereQuery = {
          title: { contains: query }
        };
      }

      const response = await this.databaseService.infobite.findMany({
        where: whereQuery,
        include: {
          updatedBy: {
            select: {
              name: true
            }
          }
        },
        skip,
        take: limit
      });

      const metaData: MetaData = { currentpage: page, limit, totalPages: response.length, totalRecord };
      return new CustomResponse<Infobite[]>(true, "Infobite List Found.", response, metaData);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }


  async findAllPublic(page: number, limit: number, query: string) {
    try {
      const skip = (page - 1) * limit;
      const totalRecord = await this.databaseService.infobite.count({
        where: {
          title: {
            contains: query
          },
          status: 'active'
        },
      });

      if (!totalRecord) return new CustomResponse(false, "Infobite Not Found.", {});

      let whereQuery: Prisma.InfobiteWhereInput = {};

      if (query) {
        whereQuery = {
          title: { contains: query },
          status: 'active'
        };
      }

      const response = await this.databaseService.infobite.findMany({
        where: whereQuery,
        skip,
        take: limit
      });

      const metaData: MetaData = { currentpage: page, limit, totalPages: response.length, totalRecord };
      return new CustomResponse<Infobite[]>(true, "Infobite List Found.", response, metaData);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async statusUpdateOne(id: number, updateStatus: StatusUpdate) {
    try {
      const isExists = await this.databaseService.infobite.findUnique({
        where: {
          id,
        }
      });

      if (!isExists) return new CustomResponse(false, "Infobite Not Found.", {});

      await this.databaseService.infobite.update({
        where: {
          id
        },
        data: {
          status: updateStatus.status
        }
      });


      return new CustomResponse(true, "Infobite Status Successfuly Updated.", {});

    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }


  async findOne(id: number) {
    try {
      const response = await this.databaseService.infobite.findUnique({
        where: {
          id,
        },
        include: {
          updatedBy: {
            select: {
              name: true
            }
          }
        }
      });

      if (!response) return new CustomResponse(false, "Infobite Not Found.", {});

      return new CustomResponse<Infobite>(true, "Infobite Found.", response);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async update(id: number, updateInfobiteDto: UpdateInfobiteDto, filename: string, user: Express.User) {
    try {
      const reqUser = user as RequestUser;
      const isExists = await this.databaseService.infobite.findUnique({
        where: {
          id
        }
      });

      if (!isExists) return new CustomResponse(false, "Infobite Not Found.", {});

      const response = await this.databaseService.infobite.update({
        where: {
          id
        },
        data: {
          title: updateInfobiteDto.title,
          picture: filename,
          updatedBy: {
            connect: {
              id: reqUser?.id
            }
          }
        }
      });

      if (!response) return new CustomResponse(false, "Infobite Not Found.", {});

      return new CustomResponse(true, "Infobite Successfuly Updated.", {});

    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number) {
    try {
      const isExists = await this.databaseService.infobite.findUnique({
        where: {
          id
        }
      });

      if (!isExists) return new CustomResponse(false, "Infobite Not Found.", {});

      const response = await this.databaseService.infobite.delete({
        where: { id },
      });

      if (!response) return new CustomResponse(false, "Infobite Not Found.", {});

      return new CustomResponse(true, "Infobite Successfuly Deleted.", {});

    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
