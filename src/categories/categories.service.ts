import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Category, Prisma } from '@prisma/client';
import { CustomResponse } from 'src/shared/responses/CustomResponse';
import { DatabaseService } from 'src/database/database.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { StatusUpdate } from 'src/shared/dto/status-update.dto';



@Injectable()
export class CategoriesService {
  constructor(private readonly databaseService: DatabaseService) { }

  async create(createCategoryDto: CreateCategoryDto, filename: string, user: Express.User) {
    try {
      const reqUser = user as RequestUser;
      const isExists = await this.databaseService.category.findFirst({
        where: {
          name: {
            equals: createCategoryDto.name
          }
        }
      });

      if (isExists) return new CustomResponse(false, "Category Already Exists.", {});


      const response = await this.databaseService.category.create({
        data: {
          name: createCategoryDto.name,
          icon: filename,
          parentId: createCategoryDto.parentId,
          catAddedBy: {
            connect: {
              id: reqUser?.id
            }
          }
        }
      });

      if (!response) return new CustomResponse(false, "Category Not Saved.", {});

      return new CustomResponse(true, "Category Successfuly Saved.", {});

    } catch (error) {
      throw new InternalServerErrorException();
    }

  }

  async findAll(page: number, limit: number, query: string) {
    try {
      const skip = (page - 1) * limit;
      const totalRecord = await this.databaseService.category.count({
        where: {
          name: {
            contains: query
          }
        },
      });

      if (!totalRecord) return new CustomResponse(false, "Category List Not Found.", {});

      let whereQuery: Prisma.CategoryWhereInput = { status: 'active' };

      if (query) {
        whereQuery = {
          name: { contains: query }
        };
      }

      const response = await this.databaseService.category.findMany({
        where: whereQuery,
        include: {
          catAddedBy: {
            select: {
              name: true
            }
          }
        },
        skip,
        take: limit
      });

      const metaData: MetaData = { currentpage: page, limit, totalPages: response.length, totalRecord };
      return new CustomResponse<Category[]>(true, "Category List Found.", response, metaData);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }


  // Public 
  async findAllPublic(page: number, limit: number, query: string) {
    try {
      const skip = (page - 1) * limit;
      const totalRecord = await this.databaseService.category.count({
        where: {
          name: {
            contains: query
          },
          status: 'active'
        },
      });

      if (!totalRecord) return new CustomResponse(false, "Category List Not Found.", {});

      let whereQuery: Prisma.CategoryWhereInput = { status: 'active' };

      if (query) {
        whereQuery = {
          name: { contains: query },
          status: 'active'
        };
      }

      const response = await this.databaseService.category.findMany({
        where: whereQuery,
        skip,
        take: limit
      });

      const metaData: MetaData = { currentpage: page, limit, totalPages: response.length, totalRecord };
      return new CustomResponse<Category[]>(true, "Category List Found.", response, metaData);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async statusUpdateOne(id: number, updateStatus: StatusUpdate) {
    try {
      const isExists = await this.databaseService.category.findUnique({
        where: {
          id,
        }
      });

      if (!isExists) return new CustomResponse(false, "Category Not Found.", {});

      await this.databaseService.category.update({
        where: {
          id
        },
        data: {
          status: updateStatus.status
        }
      });


      return new CustomResponse(true, "Category Status Successfuly Updated.", {});

    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: number) {
    try {
      const response = await this.databaseService.category.findUnique({
        where: {
          id,
        },
        include: {
          catAddedBy: {
            select: {
              name: true
            }
          }
        },
      });

      if (!response) return new CustomResponse(false, "Category Not Found.", {});

      return new CustomResponse<Category>(true, "Category Found.", response);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto, filename: string) {
    try {
      const isExists = await this.databaseService.category.findUnique({
        where: {
          id
        }
      });

      if (!isExists) return new CustomResponse(false, "Category Not Found.", {});

      const response = await this.databaseService.category.update({
        where: {
          id
        },
        data: {
          icon: filename,
          ...updateCategoryDto
        }
      });

      if (!response) return new CustomResponse(false, "Category Not Found.", {});

      return new CustomResponse(true, "Category Successfuly Updated.", {});

    } catch (error) {
      throw new InternalServerErrorException();
    }
  }


  async remove(id: number) {
    try {
      const isExists = await this.databaseService.category.findUnique({
        where: {
          id
        }
      });

      if (!isExists) return new CustomResponse(false, "Category Not Found.", {});

      const response = await this.databaseService.category.delete({
        where: { id },
      });

      if (!response) return new CustomResponse(false, "Category Not Found.", {});

      return new CustomResponse(true, "Category Successfuly Deleted.", {});

    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
