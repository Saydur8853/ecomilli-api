import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { StatusUpdate } from 'src/shared/dto/status-update.dto';
import { FileUploadInterceptor } from 'src/shared/interceptors/file.interceptor';


@Controller('v1')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @UseGuards(JwtAuthGuard)
  @Post('categories')
  @UseInterceptors(new FileUploadInterceptor("icon", ["image/png", 'image/jpg', 'image/jpeg']).getInterceptor())
  create(@Body() createCategoryDto: CreateCategoryDto, @UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    return this.categoriesService.create(createCategoryDto, file ? file.filename : null, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('categories')
  findAll(@Query('page') page: string, @Query('limit') limit: string, @Query('query') query: string) {
    return this.categoriesService.findAll(Number(page) || 1, Number(limit) || 10, query);
  }

  // Public front-end api 
  @Get('frontend/categories')
  findAllPublic(@Query('page') page: string, @Query('limit') limit: string, @Query('query') query: string) {
    return this.categoriesService.findAllPublic(Number(page) || 1, Number(limit) || 10, query);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('categories/status-update/:id')
  statusUpdateOne(@Param('id') id: string, @Body() updateStatus: StatusUpdate) {
    return this.categoriesService.statusUpdateOne(+id, updateStatus);
  }

  @UseGuards(JwtAuthGuard)
  @Get('categories/:id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('categories/:id')
  @UseInterceptors(new FileUploadInterceptor("icon", ["image/png", 'image/jpg', 'image/jpeg']).getInterceptor())
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto, @UploadedFile() file: Express.Multer.File) {
    return this.categoriesService.update(+id, updateCategoryDto, file ? file.filename : null,);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('categories/:id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
