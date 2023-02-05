import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean } from 'class-validator'
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    id?: string

    @ApiProperty()
    @IsBoolean()
    isDelete?: boolean

    @ApiProperty()
    @IsString()
    updatedBy?:string
}
