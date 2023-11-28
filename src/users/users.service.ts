import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CustomResponse } from 'src/shared/responses/CustomResponse';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { StatusUpdate } from 'src/shared/dto/status-update.dto';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) { }
  private readonly logger = new Logger(UsersService.name);
  async create(createUserDto: CreateUserDto) {
    try {
      // Checking user exists or not 
      const isExists = await this.databaseService.user.findFirst({
        where: {
          OR: [
            { email: { equals: createUserDto.email } },
            { phone: { equals: createUserDto.phone } },
          ]
        }
      });

      if (isExists) return new CustomResponse(false, "Email address/Phone is already used.", {});

      // Now creating a user   
      const hashedPassword = bcrypt.hashSync(createUserDto.password, 10);

      const response = await this.databaseService.user.create({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          phone: createUserDto.phone,
          avatar: createUserDto.avatar,
          password: hashedPassword,
          role: {
            connectOrCreate: {
              create: {
                name: "Admin"
              },
              where: {
                id: 1
              }
            }
          }
        }
      });

      if (!response) return new CustomResponse(false, "User Not Saved.", {});

      return new CustomResponse(true, "User Successfuly Saved.", {});

    } catch (error) {
      throw new InternalServerErrorException(error);
    }

  }

  async findAll(page: number, limit: number, query: string, dateRange?: string) {
    try {
      const skip = (page - 1) * limit;
      const totalRecord = await this.databaseService.user.count();

      if (!totalRecord) return new CustomResponse(false, "User Not Found.", {});

      const whereQuery: Prisma.UserWhereInput = {
        status: 'active',
        AND: [
          {
            OR: [
              { name: { contains: query || '' } },
              { email: { contains: query || '' } },
              { phone: { contains: query || '' } },
            ],
          },
        ].filter(Boolean) as Prisma.UserWhereInput[],
      };

      if (dateRange) {
        const [startDate, endDate] = dateRange.split('_').map((date) => new Date(date));
        if (startDate && endDate) {
          whereQuery.createdAt = {
            gte: startDate.toISOString(),
            lte: endDate.toISOString(),
          };
        }
        this.logger.debug(startDate, endDate);
      }



      const response = await this.databaseService.user.findMany({
        where: whereQuery,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          avatar: true,
          roleId: true,
          role: {
            select: {
              name: true
            }
          }
        },
        skip,
        take: limit
      });

      const metaData: MetaData = { currentpage: page, limit, totalPages: response.length, totalRecord };
      return new CustomResponse(true, "User List Found.", response, metaData);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }


  async statusUpdateOne(id: number, updateStatus: StatusUpdate) {
    try {
      const isExists = await this.databaseService.user.findUnique({
        where: {
          id,
        }
      });

      if (!isExists) return new CustomResponse(false, "User Not Found.", {});

      await this.databaseService.user.update({
        where: {
          id
        },
        data: {
          status: updateStatus.status
        }
      });


      return new CustomResponse(true, "User Status Successfuly Updated.", {});

    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }


  async findOne(id: number) {
    try {
      const response = await this.databaseService.user.findUnique({
        where: {
          id,
          status: 'active'
        },
        select: {
          name: true,
          email: true,
          phone: true,
          avatar: true,
          roleId: true,
          role: {
            select: {
              name: true
            }
          }
        }
      });

      if (!response) return new CustomResponse(false, "User Not Found.", {});

      return new CustomResponse(true, "User Found.", response);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      // Checking user exists or not 
      const isExists = await this.databaseService.user.findUnique({
        where: {
          id
        }
      });

      if (!isExists) return new CustomResponse(false, "User Not Found.", {});


      let updatedUserData: Prisma.UserUpdateInput = {
        name: updateUserDto.name,
        email: updateUserDto.email,
        phone: updateUserDto.phone,
        avatar: updateUserDto.avatar
      };

      // Check if roleId is provided in updateUserDto, then connect to that role
      if (updateUserDto.roleId) {
        updatedUserData.role = { connect: { id: updateUserDto.roleId } };
      } else {
        updatedUserData.role = {
          connectOrCreate: {
            create: {
              name: "Admin"
            },
            where: {
              id: 1
            }
          }
        };
      }

      if (updateUserDto.password) {
        const hashedPassword = bcrypt.hashSync(updateUserDto.password, 10);
        updatedUserData = {
          ...updatedUserData,
          password: hashedPassword
        };
      }

      // Perform the update operation
      const response = await this.databaseService.user.update({
        where: { id },
        data: updatedUserData
      });

      if (!response) return new CustomResponse(false, "User Not Updated.", {});

      return new CustomResponse(true, "User Successfuly Updated.", {});

    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number) {
    try {
      // Checking user exists or not 
      const isExists = await this.databaseService.user.findUnique({
        where: {
          id
        }
      });

      if (!isExists) return new CustomResponse(false, "Role Not Found.", {});

      // Deleting user record 
      const response = await this.databaseService.user.delete({
        where: { id },
      });

      if (!response) return new CustomResponse(false, "User Not Found.", {});

      return new CustomResponse(true, "User Successfuly Deleted.", {});

    } catch (error) {
      throw new InternalServerErrorException();
    }
  }



  async findUserProfile(id: number) {
    try {
      const response = await this.databaseService.user.findUnique({
        where: {
          id
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          avatar: true,
          roleId: true,
          role: {
            select: {
              name: true
            }
          },
        },
      });

      if (!response) return new CustomResponse(false, "Profile Not Found.", {});

      return new CustomResponse(true, "Profile Found.", response);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async updateUserProfile(id: number, updateUserDto: UpdateUserDto) {
    try {
      let updatedUserData: Prisma.UserUpdateInput = {
        name: updateUserDto.name,
        email: updateUserDto.email,
        phone: updateUserDto.phone,
        avatar: updateUserDto.avatar
      };


      if (updateUserDto.password) {
        const hashedPassword = bcrypt.hashSync(updateUserDto.password, 10);
        updatedUserData = {
          ...updatedUserData,
          password: hashedPassword
        };
      }

      // Perform the update operation
      const response = await this.databaseService.user.update({
        where: { id },
        data: updatedUserData
      });

      if (!response) return new CustomResponse(false, "Profile Updated Unsuccessful.", {});

      return new CustomResponse(true, "Profile Successsfylly Updated.", {});
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }



}
