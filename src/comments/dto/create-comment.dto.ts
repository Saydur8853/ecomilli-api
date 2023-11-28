import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCommentDto { 
    @IsNotEmpty()
    @IsString()
    comment: string;  
    
    @IsOptional()
    @IsInt()
    parentId?: number  

    @IsNotEmpty()
    @IsInt()
    newsId: number   
}
