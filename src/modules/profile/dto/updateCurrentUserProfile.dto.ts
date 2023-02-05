import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class UpdateCurrentProfileDTO {

    id:string
 
    @ApiPropertyOptional()
    firstName?: string;

    @ApiPropertyOptional()
    lastName?: string;

    @ApiPropertyOptional()
    phoneNumber?: string;

    @ApiPropertyOptional()
    businessName?: string;

    @ApiPropertyOptional()
    description?: string;

    @ApiPropertyOptional()   
    address?: string;

    @ApiPropertyOptional()
    website?: string;

    @ApiPropertyOptional({
                type: 'string', 
                format: 'binary' 
            })
    @IsOptional()
    avatar?: any;

    @ApiPropertyOptional({ 
                type: 'string', 
                format: 'binary' 
            })
    @IsOptional()
    coverImage?: any;

    @ApiPropertyOptional()
    backgroundColor?: string;

    @ApiPropertyOptional()
    textColor?: string;

    @ApiPropertyOptional()
    zalo?: string;

    @ApiPropertyOptional()
    whatapps?: string;

    @ApiPropertyOptional()
    telegram?: string;

    @ApiPropertyOptional()
    skype?: string;

    @ApiPropertyOptional()
    facebook?: string;

    @ApiPropertyOptional()
    instagram?: string;

    @ApiPropertyOptional()
    twitter?: string;

    @ApiPropertyOptional()
    linkedin?: string;

    @ApiPropertyOptional()
    momo?: string;

    @ApiPropertyOptional()
    zalopay?: string;

    updatedBy: string
}