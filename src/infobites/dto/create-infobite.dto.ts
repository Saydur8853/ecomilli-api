import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateInfobiteDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  picture?: string; 
}
