import { NewsSource, NewsStatus } from '@prisma/client';
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateNewsDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  slug: string;

  @IsNotEmpty()
  catId: number;

  @IsOptional()
  @IsString()
  authors?: string;

  @IsOptional()
  @IsString()
  featuredImage?: string;

  @IsNotEmpty()
  @IsString()
  shortDesc: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  imgSourceUrl?: string;

  @IsOptional()
  @IsString()
  originalNewsUrl?: string;

  @IsOptional()
  @IsEnum(NewsSource)
  newsSource?: NewsSource;

  @IsOptional()
  @IsEnum(NewsStatus)
  status?: NewsStatus;

  @IsOptional()
  @IsArray()
  tags?: Tag[];

  @IsOptional()
  @IsArray()
  galleryImages?: GalleryImage[];
}


class Tag {
  @IsNotEmpty()
  @IsString()
  name: string
}

class GalleryImage {
  @IsNotEmpty()
  @IsString()
  image: string
}