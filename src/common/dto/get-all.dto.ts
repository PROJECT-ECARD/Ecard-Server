import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsBoolean, IsString } from 'class-validator';

export class ParameterGetListDTO {
    @ApiProperty()
    pageNumber?: number

    @ApiProperty()
    pageSize?: number
    
    // @ApiProperty()
    // skip: number = 0
    
    // @ApiProperty()
    // top?: number
    
    @ApiProperty()
    orderBy?: string
    
    @ApiProperty()
    isDropdown?: boolean
    
    @ApiProperty()
    searchValue?: string
    
    @ApiProperty()
    searchText?: string 

    @ApiProperty()
    profileId?: string
}