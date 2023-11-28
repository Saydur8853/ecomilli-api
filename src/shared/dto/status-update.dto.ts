import { Status } from "@prisma/client";
import { IsEnum, IsNotEmpty } from "class-validator";

export class StatusUpdate {
    @IsNotEmpty()
    @IsEnum(Status)
    status: Status
}