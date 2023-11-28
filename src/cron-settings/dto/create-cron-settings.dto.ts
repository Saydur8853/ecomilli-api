import { IsString, IsNotEmpty, IsOptional, IsNumber, IsPositive } from 'class-validator';

export class CreateCronSettingsDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  job: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  scheduleId: number;

  @IsOptional()
  @IsString()
  timeZone?: string;
}
