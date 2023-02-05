import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class UpdateQrDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    id: string
}