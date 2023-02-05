/* eslint-disable prettier/prettier */
/* eslint-disable prefer-const */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UserRole, UserStatus } from 'src/common/constants';
import { ParameterGetListDTO } from 'src/common/dto/get-all.dto';
import { ResponseCommon } from 'src/common/dto/respone.dto';
import { IResponse } from 'src/common/Interfaces/respone.interface';
import { users } from 'src/modules/users/seed/data';
import { Repository } from 'typeorm';
import { LoginUserDto } from '../core/auth/dto/in-login.dto';
import { RegisterDto } from '../core/auth/dto/in-register.dto';
import { JwtPayload } from '../core/auth/interfaces/payload.interface';
import { ProfileService } from '../profile/profile.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDTO } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
		private readonly profileService: ProfileService
	) { }

	async update(userId: string, updateUserDto: UpdateUserDto): Promise<IResponse> {
		await this.userRepository.update(userId, updateUserDto)
		const updateUser = await this.userRepository.findOne({ where: { id: userId } })
		if (updateUser) {
			return new ResponseCommon(200, true, 'UPDATE_USER_SUCCESS', null)
		}
	}

	async seedAdmin(): Promise<IResponse> {
		const userInDb = await this.userRepository.findOne({ where: { email: users.email } })
		if (userInDb) {
			return new ResponseCommon(400, false, 'EMAIL_ALREADY_EXIST')
		} else {
			const userDto: CreateUserDto = {
				email: users.email,
				password: users.password,
				status: UserStatus.ACTIVE,
				role: UserRole.ADMIN,
				createdBy: users.firstName + " " + users.lastName
			}
			const resultInDb = await this.userRepository.create(userDto)
			await this.userRepository.save(resultInDb)
			return new ResponseCommon(200, true, 'SEED_ADMIN_SUCCESS', resultInDb)
		}
	}

	async create(registerDto: RegisterDto): Promise<IResponse> {
		const userInDb = await this.userRepository.findOne({
			where: { email: registerDto.email }
		});
		if (!userInDb) {
			const userDto: CreateUserDto = {
				email: registerDto.email,
				password: registerDto.password,
				status: UserStatus.NEW,
				role: UserRole.CUSTOMER,
				createdBy: registerDto.firstName + " " + registerDto.lastName
			}
			const resultInDb = await this.userRepository.create(userDto);
			await this.userRepository.save(resultInDb)
			if (resultInDb) {
				return new ResponseCommon(201, true, "CREATE_USER_SUCCESS", resultInDb);
			}
			return new ResponseCommon(500, false, "SERVER_ERROR", null);
		}
		return new ResponseCommon(400, false, "EMAIL_ALREADY_EXIST", null);
	}

	async findByLogin({ email, password }: LoginUserDto): Promise<IResponse> {
		const userInDb = await this.userRepository.findOne({ where: { email: email } })
		if (!userInDb) {
			return new ResponseCommon(404, false, "USER_NOT_FOUND", null);
		}

		const comparePassword = await bcrypt.compare(password, userInDb.password);
		if (!comparePassword) {
			return new ResponseCommon(400, false, "PASSWORD_INCORECT", null);
		}
		return new ResponseCommon(200, true, "FIND_USER_SUCCESS", userInDb);
	}

	
	async findByPayload(email: string): Promise<UserEntity> {
		const user = await this.userRepository.findOne({
			where: { email:email }
		})
		console.log(user);
		
		return user
	}

	async validateUser(payload: JwtPayload): Promise<UserEntity> {
		const user = await this.findByPayload(payload.email);
		if (!user) {
			return
		}
		return user;
	}

	async getUserProfile(userId: string): Promise<IResponse> {
		const user = await this.userRepository.findOne({ where: { id: userId } });
		if (!user) {
			return new ResponseCommon(404, false, "USER_NOT_FOUND", null);
		}
		return new ResponseCommon(200, true, "GET_ME_SUCCESS", user);
	}

	async getAllUser(propsGet: ParameterGetListDTO): Promise<IResponse> {
		let users: any; // danh sach user
		let skip; // bo qua bao nhieu phan tu
		let take = propsGet.pageSize; // lay bao nhieu phan tu

		if (propsGet.isDropdown) {
			users = await this.userRepository.find();
		} else {
			if (propsGet.searchValue) {
				// tim kiem chinh xac theo email
				let emailValue = propsGet.searchValue;
				users = await this.userRepository.find({
					where: { email: emailValue },
				});
			}
			// if (take) {
			// 	if (!propsGet.skip) {
			// 		skip = 0;
			// 	} else {
			// 		skip = propsGet.skip
			// 	}
			// 	await this.userRepository
			// 		.findAndCount({ take, skip })
			// 		.then(([user]) => {
			// 			users = user;
			// 		});
			// }
			// orderby ASC sap xep theo abc, DESC sap xep theo cba
			if (propsGet.orderBy) {
				let type = propsGet.orderBy
				if (type === 'ASC') {
					users = await this.userRepository.find({ order: { email: 'ASC' } })
				} else {
					users = await this.userRepository.find({ order: { email: 'DESC' } })

				}
			}

		}
		return new ResponseCommon(200, true, 'GET_All_USER_SUCCESS', users);
	}


	//chua hash password
	async updatePassword(userId: string, updatePass: UpdatePasswordDTO) {
		const resultUser = await this.userRepository.findOneById(userId)
		const comparePassword = await bcrypt.compare(updatePass.passwordOld, resultUser.password)
		if (!comparePassword) {
			return new ResponseCommon(400, false, "PASSWORD_NOT_MATCHING", null)
		} else {
			const salt = await bcrypt.genSalt(10)
			const hashed = await bcrypt.hash(updatePass.passwordNew, salt)
			await this.userRepository.update(userId, { password: hashed })
			const resultUserUpdate = await this.userRepository.findOneById(userId)
			return new ResponseCommon(200, true, "UPDATE_PASSWORD_SUCCESS", resultUserUpdate)
		}
	}

	//delete user
	async deleteUser(userId: string): Promise<IResponse> {
		const userDelete = await this.userRepository.findOneById(userId)
		if (userDelete) {
			await this.userRepository.update(userId, { isDelete: true })
			await this.profileService.deleteProfile(userId)
			return new ResponseCommon(200, true, "USER_AND_PROFILE_IS_DELETED")
		} else {
			return new ResponseCommon(404, false, "USER_NOT_FOUND")
		}
	}

	async lockUser(userId: string): Promise<IResponse> {
		const userLock = await this.userRepository.findOneById(userId)
		if (userLock) {
			await this.userRepository.update(userId, { status: UserStatus.LOCK })
			return new ResponseCommon(200, true, "USER_LOCKED")
		} else {
			return new ResponseCommon(404, false, "USER_NOT_FOUND")
		}
	}
}