import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { DatabaseService } from 'src/database/database.service';
import { CustomResponse } from 'src/shared/responses/CustomResponse';
import { Prisma, Comment } from '@prisma/client';
import { StatusUpdate } from 'src/shared/dto/status-update.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly databaseService: DatabaseService) { }

  async create(createCommentDto: CreateCommentDto) {
    try {
      const response = await this.databaseService.comment.create({
        data: {
          comment: createCommentDto.comment,
          news: {
            connect: {
              id: createCommentDto.newsId
            }
          },
          parentId: createCommentDto.parentId,
        }
      });

      if (!response) return new CustomResponse(false, "Comment Not Saved.", {});

      return new CustomResponse(true, "Comment Successfuly Saved.", {});

    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(page: number, limit: number, query: string) {
    try {
      const skip = (page - 1) * limit;
      const totalRecord = await this.databaseService.comment.count({
        where: {
          comment: {
            contains: query
          }
        },
      });

      if (!totalRecord) return new CustomResponse(false, "Comment Not Found.", {});

      let whereQuery: Prisma.CommentWhereInput = {};

      if (query) {
        whereQuery = {
          comment: { contains: query }
        };
      }

      const response = await this.databaseService.comment.findMany({
        where: whereQuery,
        skip,
        take: limit
      });

      const metaData: MetaData = { currentpage: page, limit, totalPages: response.length, totalRecord };
      return new CustomResponse<Comment[]>(true, "Comment List Found.", response, metaData);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async statusUpdateOne(id: number, updateStatus: StatusUpdate) {
    try {
      const isExists = await this.databaseService.comment.findUnique({
        where: {
          id,
        }
      });

      if (!isExists) return new CustomResponse(false, "Comment Not Found.", {});

      await this.databaseService.comment.update({
        where: {
          id
        },
        data: {
          status: updateStatus.status
        }
      });


      return new CustomResponse(true, "Comment Status Successfuly Updated.", {});

    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }


  async findOne(id: number) {
    try {
      const response = await this.databaseService.comment.findUnique({
        where: {
          id
        }
      });

      if (!response) return new CustomResponse(false, "Comment Not Found.", {});

      return new CustomResponse<Comment>(true, "Comment Found.", response);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async update(id: number, updateRoleDto: UpdateCommentDto) {
    try {
      const isExists = await this.databaseService.comment.findUnique({
        where: {
          id
        }
      });

      if (!isExists) return new CustomResponse(false, "Comment Not Found.", {});

      const response = await this.databaseService.comment.update({
        where: {
          id
        },
        data: updateRoleDto
      });

      if (!response) return new CustomResponse(false, "Comment Not Found.", {});

      return new CustomResponse(true, "Comment Successfuly Updated.", {});

    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number) {
    try {
      const isExists = await this.databaseService.comment.findUnique({
        where: {
          id
        }
      });

      if (!isExists) return new CustomResponse(false, "Comment Not Found.", {});

      const response = await this.databaseService.comment.delete({
        where: { id },
      });

      if (!response) return new CustomResponse(false, "Comment Not Found.", {});

      return new CustomResponse(true, "Comment Successfuly Deleted.", {});

    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
