import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, Length } from "class-validator";

export class UpdateProfileDTO{
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    id: string;

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

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    businessName?: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    description?: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    address?: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    website?: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    avatar?: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    coverImage?: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    backgroundColor?: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    textColor?: string;

    @ApiProperty()
    @IsString()
    zalo?: string;

    @ApiProperty()
    @IsString()
    whatapps?: string;

    @ApiProperty()
    @IsString()
    telegram?: string;

    @ApiProperty()
    @IsString()
    skype?: string;

    @ApiProperty()
    @IsString()
    facebook?: string;

    @ApiProperty()
    @IsString()
    instagram?: string;

    @ApiProperty()
    @IsString()
    twitter?: string;

    @ApiProperty()
    @IsString()
    linkedin?: string;

    @ApiProperty()
    @IsString()
    momo?: string;

    @ApiProperty()
    @IsString()
    zalopay?: string;
}