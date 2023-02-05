/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsString } from 'class-validator';
import { UserRole, UserStatus } from 'src/common/constants';

export class CreateUserDto {
    id?: string;

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
    createdBy?: string;

    status?: UserStatus

    role?: UserRole
}
