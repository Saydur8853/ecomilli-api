import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTagDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  newsId: number;
}
