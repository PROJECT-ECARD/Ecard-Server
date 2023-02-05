import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsNotEmpty } from "class-validator"

export class CreateRelationshipDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    senderId: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    receiverId: string
}