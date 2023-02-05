import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateProfileDTO{
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    id?: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    qrCode?: string;

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
    @Length(10)
    phoneNumber?: string;
}