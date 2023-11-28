import { IsOptional, IsString, Matches } from 'class-validator';

export class FindAllQueryDto {
    @IsOptional()
    @IsString()
    query: string;

    @IsOptional()
    @IsString()
    page: string;

    @IsOptional()
    @IsString()
    limit: string;

    @IsOptional()
    @IsString()
    @Matches(/^\d{4}-\d{2}-\d{2}_\d{4}-\d{2}-\d{2}$/, { message: "DateRange must be in this format: YYYY-MM-DD_YYYY-MM-DD." })
    dateRange?: string;
}
