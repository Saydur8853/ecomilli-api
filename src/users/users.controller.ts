import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { StatusUpdate } from 'src/shared/dto/status-update.dto';
import { FindAllQueryDto } from 'src/shared/dto/find-all-query.dto';

@UseGuards(JwtAuthGuard)
@Controller('v1')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('users')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('users')
  findAll(@Query() findAllUsersDto: FindAllQueryDto) {
    const { page, limit, query, dateRange } = findAllUsersDto;

    return this.usersService.findAll(Number(page) || 1, Number(limit) || 10, query, dateRange);
  }

  @Get('users/userprofile')
  findUserProfile(@Req() req: Request) {
    const reqUser = req.user as RequestUser;
    return this.usersService.findUserProfile(reqUser?.id);
  }
  @Patch('users/userprofile')
  updateUserProfile(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {
    const reqUser = req.user as RequestUser;
    return this.usersService.updateUserProfile(reqUser?.id, updateUserDto);
  }

  @Patch('categories/status-update/:id')
  statusUpdateOne(@Param('id') id: string, @Body() updateStatus: StatusUpdate) {
    return this.usersService.statusUpdateOne(+id, updateStatus);
  }

  @Get('users/:id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch('users/:id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete('users/:id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

}
