import { NewsSource, NewsStatus } from '@prisma/client';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsArray } from 'class-validator';

export class CreateNewsDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  slug: string;

  @IsOptional()
  catId?: number;

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
  galleryImages?: GalleryImages[];
}


class Tag {
  @IsNotEmpty()
  @IsString()
  name: string
}

class GalleryImages {
  @IsNotEmpty()
  @IsString()
  image: string
}