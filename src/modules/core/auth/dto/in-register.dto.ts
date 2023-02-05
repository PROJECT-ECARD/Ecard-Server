import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEmpty, IsNotEmpty, IsString } from "class-validator";
import { UserEntity } from "src/modules/users/entities/user.entity";

export class RegisterDto {
    
    user?: UserEntity
    
    id?:string

    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email?: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password?: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    confirmPassword?: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    firstName?: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    lastName?: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    phoneNumber?: string;

    createdBy?: string;

    @IsEmpty()
    updateddBy?: string;

    createdDate?: string;

    @IsEmpty()
    updatedDate?: string;

}
