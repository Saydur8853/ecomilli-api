import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UseGuards, UseInterceptors, UploadedFiles, ValidationPipe } from '@nestjs/common';
import { NewsService } from './news.service';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { UpdateManyStatus, UpdateStatus } from './dto/update-status.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ImageUpload, ImageUploadDto } from './dto/image-upload.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('v1')
export class NewsController {
  constructor(private readonly newsService: NewsService) { }

  @UseGuards(JwtAuthGuard)
  @Post('news')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'featuredImage', maxCount: 1 },
      { name: 'galleryImages', maxCount: 10 },
    ], {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const fileExt = extname(file.originalname)
          const fileName = `${file.originalname.split('.')[0].toLowerCase().replace(/ /g, "-")}_${Date.now()}${fileExt}`;
          cb(null, fileName);
        },
      })
    })
  )
  create(@Body(new ValidationPipe({ transform: true })) createNewsDto: CreateNewsDto, @UploadedFiles() files: ImageUploadDto, @Req() req: Request) {
    const { featuredImage, galleryImages } = files;
    const imageData: ImageUpload = {
      featuredImage: featuredImage ? featuredImage[0].filename : null,
      galleryImages: galleryImages &&
        galleryImages?.length > 0 ?
        galleryImages?.map((image: Express.Multer.File) => ({ image: image.filename })) : null,
    };

    return this.newsService.create(createNewsDto, imageData, req.user);
  }


  @UseGuards(JwtAuthGuard)
  @Get('news')
  findAll(@Query('page') page: string, @Query('limit') limit: string, @Query('query') query: string, @Query('category') category: number) {
    return this.newsService.findAll(Number(page) || 1, Number(limit) || 10, query, category);
  }

  @Get('frontend/news')
  findAllPublic(@Query('page') page: string, @Query('limit') limit: string, @Query('query') query: string, @Query('tag') tag: string, @Query('category') category: number) {
    return this.newsService.findAllPublic(Number(page) || 1, Number(limit) || 10, query, tag, category);
  }

  // Public 
  @Get('frontend/news/:id')
  findOnePublic(@Param('id') id: string) {
    return this.newsService.findOnePublic(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('news/status-update')
  statusUpdateAll(@Body() updateManyNewsDto: UpdateManyStatus, @Req() req: Request) {
    return this.newsService.statusUpdateAll(updateManyNewsDto, req.user);
  }


  @UseGuards(JwtAuthGuard)
  @Patch('news/status-update/:id')
  statusUpdateOne(@Param('id') id: string, @Body() updateStatus: UpdateStatus, @Req() req: Request) {
    return this.newsService.statusUpdateOne(+id, updateStatus, req.user);
  }

  @Patch('news/stat/:id')
  updateNewsViews(@Param('id') id: string, @Query('stat') stat: 'share' | 'views') {
    return this.newsService.updateNewsStat(+id, stat);
  }

  @UseGuards(JwtAuthGuard)
  @Get('news/:id')
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('news/:id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'featuredImage', maxCount: 1 },
      { name: 'galleryImages', maxCount: 10 },
    ], {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const fileExt = extname(file.originalname)
          const fileName = `${file.originalname.split('.')[0].toLowerCase().replace(/ /g, "-")}_${Date.now()}${fileExt}`;
          cb(null, fileName);
        },
      })
    })
  )
  update(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto, @UploadedFiles() files: ImageUploadDto, @Req() req: Request) {
    const { featuredImage, galleryImages } = files;

    const imageData: ImageUpload = {
      featuredImage: featuredImage ? featuredImage[0].filename : null,
      galleryImages: galleryImages &&
        galleryImages?.length > 0 ?
        galleryImages?.map((image: Express.Multer.File) => ({ image: image.filename })) : null,
    };

    return this.newsService.update(+id, updateNewsDto, imageData, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('news/:id')
  remove(@Param('id') id: string) {
    return this.newsService.remove(+id);
  }





}
