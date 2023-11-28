import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { InfobitesService } from './infobites.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { CreateInfobiteDto } from './dto/create-infobite.dto';
import { UpdateInfobiteDto } from './dto/update-infobite.dto';
import { StatusUpdate } from 'src/shared/dto/status-update.dto';
import { FileUploadInterceptor } from 'src/shared/interceptors/file.interceptor';


@Controller('v1')
export class InfobitesController {
  constructor(private readonly infobitesService: InfobitesService) { }

  @UseGuards(JwtAuthGuard)
  @Post('infobites')
  @UseInterceptors(new FileUploadInterceptor("picture", ["image/png", 'image/jpg', 'image/jpeg']).getInterceptor())
  create(@Body() createInfobiteDto: CreateInfobiteDto, @UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    return this.infobitesService.create(createInfobiteDto, file ? file.filename : null, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('infobites')
  findAll(@Query('page') page: string, @Query('limit') limit: string, @Query('query') query: string) {
    return this.infobitesService.findAll(Number(page) || 1, Number(limit) || 10, query);
  }

  @Get('frontend/infobites')
  findAllPublic(@Query('page') page: string, @Query('limit') limit: string, @Query('query') query: string) {
    return this.infobitesService.findAllPublic(Number(page) || 1, Number(limit) || 10, query);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('categories/status-update/:id')
  statusUpdateOne(@Param('id') id: string, @Body() updateStatus: StatusUpdate) {
    return this.infobitesService.statusUpdateOne(+id, updateStatus);
  }


  @UseGuards(JwtAuthGuard)
  @Get('infobites/:id')
  findOne(@Param('id') id: string) {
    return this.infobitesService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('infobites/:id')
  @UseInterceptors(new FileUploadInterceptor("picture", ["image/png", 'image/jpg', 'image/jpeg']).getInterceptor())
  update(@Param('id') id: string, @Body() updateInfobiteDto: UpdateInfobiteDto, @UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    return this.infobitesService.update(+id, updateInfobiteDto, file ? file.filename : null, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('infobites/:id')
  remove(@Param('id') id: string) {
    return this.infobitesService.remove(+id);
  }
}
