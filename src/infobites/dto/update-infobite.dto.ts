import {  IsNotEmpty,   IsOptional, IsString } from 'class-validator';

export class UpdateInfobiteDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  picture?: string; 
}
