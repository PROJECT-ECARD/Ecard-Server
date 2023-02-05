/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Post, Body, Param, Delete, HttpCode, HttpStatus, UseGuards, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { IResponse } from 'src/common/Interfaces/respone.interface';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/constants';
import { UserEntity } from './entities/user.entity';
import { UpdatePasswordDTO } from './dto/update-password.dto';
import { ParameterGetListDTO } from 'src/common/dto/get-all.dto';

@Injectable()
@Controller('user')
@ApiTags('User')
@ApiBearerAuth()
@UseGuards(AuthGuard(), RolesGuard)
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@HttpCode(HttpStatus.OK)
	@ApiOperation({summary: 'get me'})
	@Get('/me')
	async me(@CurrentUser() user: UserEntity): Promise<IResponse> {
		return this.usersService.getUserProfile(user.id);
	}

	@HttpCode(HttpStatus.OK)
	@ApiOperation({summary:"get all user"})
	@Roles(UserRole.ADMIN)
	@Post('/get-user')
	async getAllUser(@Body() propsGet:ParameterGetListDTO){
		return this.usersService.getAllUser(propsGet)
	}

	@HttpCode(HttpStatus.OK)
	@ApiOperation({summary:"update password"})
	@Post('/update-pass')
	async updatePassword(@CurrentUser() user:UserEntity,@Body() updatePass: UpdatePasswordDTO  ){
		return this.usersService.updatePassword(user.id,updatePass)
	}


	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Get information user' })
	@Get('/:userId')
	async getDetailUser(@Param('userId') userId: string): Promise<IResponse> {
		return this.usersService.getUserProfile(userId);
	}

	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'delete information user' })
	@Roles(UserRole.ADMIN)
	@Delete('/delete/:userId')
	async deleteUser(@Param('userId') userId: string): Promise<IResponse> {
		return this.usersService.deleteUser(userId);
	}

	
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'lock information user' })
	@Roles(UserRole.ADMIN)
	@Delete('/lock/:userId')
	async lockUser(@Param('userId') userId: string): Promise<IResponse> {
		return this.usersService.lockUser(userId);
	}
}
