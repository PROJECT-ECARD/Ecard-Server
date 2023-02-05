import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsNotEmpty } from "class-validator"

export class UpdatePropDTO{
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    email?:string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    username?:string
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    phoneNumber?:string
}