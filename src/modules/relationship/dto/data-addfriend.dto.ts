import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsNotEmpty } from "class-validator"

export class DatafriendDto {
    @ApiProperty()
    idProfileSend?:string

    @ApiProperty()
    idProfileReceive?:string
}