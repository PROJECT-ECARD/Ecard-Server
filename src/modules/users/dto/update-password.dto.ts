/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePasswordDTO {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    passwordOld: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    passwordNew: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    passwordNewConfirm: string;
}
