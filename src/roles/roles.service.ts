import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { CustomResponse } from 'src/shared/responses/CustomResponse';
import { DatabaseService } from 'src/database/database.service';
import { CreateRoleDto } from './dto/create-role.dto';



@Injectable()
export class RolesService {
  constructor(private readonly databaseService: DatabaseService) { }

  async create(createRoleDto: CreateRoleDto) {
    try {
      const isExists = await this.databaseService.role.findFirst({
        where: {
          name: {
            equals: createRoleDto.name
          }
        }
      });

      if (isExists) return new CustomResponse(false, "Role Already Exists.", {});


      const response = await this.databaseService.role.create({
        data: createRoleDto
      });

      if (!response) return new CustomResponse(false, "Role Not Saved.", {});

      return new CustomResponse(true, "Role Successfuly Saved.", {});

    } catch (error) {
      throw new InternalServerErrorException(error);
    }

  }

  async findAll(page: number, limit: number, query: string) {
    try {
      const skip = (page - 1) * limit;
      const totalRecord = await this.databaseService.role.count({
        where: {
          name: {
            contains: query
          }
        },
      });

      if (!totalRecord) return new CustomResponse(false, "Role Not Found.", {});

      let whereQuery: Prisma.RoleWhereInput = {};

      if (query) {
        whereQuery = {
          name: { contains: query }
        };
      }

      const response = await this.databaseService.role.findMany({
        where: whereQuery,
        skip,
        take: limit
      });

      const metaData: MetaData = { currentpage: page, limit, totalPages: response.length, totalRecord };
      return new CustomResponse<Role[]>(true, "Role List Found.", response, metaData);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findOne(id: number) {
    try {
      const response = await this.databaseService.role.findUnique({
        where: {
          id
        }
      });

      if (!response) return new CustomResponse(false, "Role Not Found.", {});

      return new CustomResponse<Role>(true, "Role Found.", response);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async update(id: number, updateRoleDto: CreateRoleDto) {
    try {
      const isExists = await this.databaseService.role.findUnique({
        where: {
          id
        }
      });

      if (!isExists) return new CustomResponse(false, "Role Not Found.", {});

      const response = await this.databaseService.role.update({
        where: {
          id
        },
        data: updateRoleDto
      });

      if (!response) return new CustomResponse(false, "Role Not Found.", {});

      return new CustomResponse(true, "Role Successfuly Updated.", {});

    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number) {
    try {
      const isExists = await this.databaseService.role.findUnique({
        where: {
          id
        }
      });

      if (!isExists) return new CustomResponse(false, "Role Not Found.", {});

      const response = await this.databaseService.role.delete({
        where: { id },
      });

      if (!response) return new CustomResponse(false, "Role Not Found.", {});

      return new CustomResponse(true, "Role Successfuly Deleted.", {});

    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
