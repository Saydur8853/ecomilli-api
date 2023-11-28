import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma, Tag } from '@prisma/client';
import { CustomResponse } from 'src/shared/responses/CustomResponse';
import { DatabaseService } from 'src/database/database.service';
import { UpdateTagDto } from './dto/update-tag.dto';
import { CreateTagDto } from './dto/create-tag.dto';



@Injectable()
export class TagsService {
  constructor(private readonly databaseService: DatabaseService) { }

  async create(createTagDto: CreateTagDto) {
    try {
      const isExists = await this.databaseService.tag.findFirst({
        where: {
          AND: [
            { name: createTagDto.name },
            { newsId: createTagDto.newsId },
          ]
        }
      });

      if (isExists) return new CustomResponse(false, "Tag Already Exists.", {});

      const news = await this.databaseService.news.findFirst({
        where: {
          id: createTagDto.newsId
        }
      });

      const response = await this.databaseService.tag.create({
        data: {
          name: createTagDto.name,
          news: {
            connect: {
              id: news.id
            }
          }
        }
      });

      if (!response) return new CustomResponse(false, "Tag Not Saved.", {});

      return new CustomResponse(true, "Tag Successfuly Saved.", {});

    } catch (error) {
      throw new InternalServerErrorException();
    }

  }

  async findAll(page: number, limit: number, query: string) {
    try {
      const skip = (page - 1) * limit;
      const totalRecord = await this.databaseService.tag.count({
        where: {
          name: {
            contains: query
          },
          status: 'active'
        },
      });

      if (!totalRecord) return new CustomResponse(false, "Tag Not Found.", {});

      let whereQuery: Prisma.TagWhereInput = {};

      if (query) {
        whereQuery = {
          name: { contains: query },
          status: 'active'
        };
      }

      const response = await this.databaseService.tag.findMany({
        where: whereQuery,
        skip,
        take: limit
      });

      const metaData: MetaData = { currentpage: page, limit, totalPages: response.length, totalRecord };
      return new CustomResponse<Tag[]>(true, "Tag List Found.", response, metaData);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findOne(id: number) {
    try {
      const response = await this.databaseService.tag.findUnique({
        where: {
          id,
          status: 'active'
        }
      });

      if (!response) return new CustomResponse(false, "Tag Not Found.", {});

      return new CustomResponse<Tag>(true, "Tag Found.", response);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    try {
      const isExists = await this.databaseService.tag.findUnique({
        where: {
          id
        }
      });

      if (!isExists) return new CustomResponse(false, "Tag Not Found.", {});

      const response = await this.databaseService.tag.update({
        where: {
          id
        },
        data: updateTagDto
      });

      if (!response) return new CustomResponse(false, "Tag Not Found.", {});

      return new CustomResponse(true, "Tag Successfuly Updated.", {});

    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number) {
    try {
      const isExists = await this.databaseService.tag.findUnique({
        where: {
          id
        }
      });

      if (!isExists) return new CustomResponse(false, "Tag Not Found.", {});

      const response = await this.databaseService.tag.delete({
        where: { id },
      });

      if (!response) return new CustomResponse(false, "Tag Not Found.", {});

      return new CustomResponse(true, "Tag Successfuly Deleted.", {});

    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
