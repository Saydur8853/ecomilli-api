import { NewsStatus } from "@prisma/client";
import { IsArray, IsEnum, IsNotEmpty, IsNumber } from "class-validator";

export class UpdateStatus {
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsNotEmpty()
    @IsEnum(NewsStatus)
    status: NewsStatus;
}

// UpdateManyStatus
export class UpdateManyStatus {
    @IsNotEmpty()
    @IsEnum(NewsStatus)
    status: NewsStatus;


    @IsNotEmpty()
    @IsArray()
    newsIds: NewsIds[];
}

class NewsIds {
    @IsNotEmpty()
    @IsNumber()
    id: number;
}