import { Prisma } from "@prisma/client";
import { IsString, IsNotEmpty } from "class-validator";

export class CreateRoleDto implements Prisma.RoleCreateInput {
    @IsNotEmpty()
    @IsString()
    name: string;
}