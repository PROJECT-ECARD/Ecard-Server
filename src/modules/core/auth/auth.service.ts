/* eslint-disable prettier/prettier */
/* eslint-disable no-var */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { plainToClass } from 'class-transformer';
import { hostConfig, jwtConfigs, templateConfig, timeConfig } from 'src/common/configs';
import { UserStatus } from 'src/common/constants';
import { ResponseCommon } from 'src/common/dto/respone.dto';
import { IResponse } from 'src/common/Interfaces/respone.interface';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { UsersService } from 'src/modules/users/users.service';
import { LoginUserDto } from './dto/in-login.dto';
import { JwtPayload } from './interfaces/payload.interface';
import * as bcrypt from 'bcrypt'
import { ProfileService } from 'src/modules/profile/profile.service';
import { RegisterDto } from './dto/in-register.dto';
import { GenerateTokenDto } from './dto/generate-token.dto';
import { TokenVerify } from './dto/token.dto';
import jwt_decode from "jwt-decode";
import { UpdateUserDto } from 'src/modules/users/dto/update-user.dto';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
import Mail from 'src/common/templates/send-mail.template';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { SendMailDto } from './dto/send-mail.dto';
const otpGenerator = require('otp-generator')

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UsersService,
		private readonly profileService: ProfileService,
		private readonly jwtService: JwtService,
		private readonly mail: Mail,
		@InjectQueue('email-queue')
		private readonly queueService: Queue
	) { }

	async seedAdmin(): Promise<IResponse> {
		const rs = await this.userService.seedAdmin()
		if (rs.success)
			return new ResponseCommon(200, true, 'SEED_SUCCESS')
		return new ResponseCommon(400, false, 'EMAIL_ALREADY_EXIST')
	}
	//================Register & Login=================
	async register(registerDto: RegisterDto): Promise<IResponse> {
		try {
			if (registerDto.password == registerDto.confirmPassword) {
				const user = await this.userService.findByPayload(registerDto.email)
				if (!user) {
					const createUser = await this.userService.create(registerDto);
					createUser.data.password = undefined
					// create profile and qr code
					registerDto.user = createUser.data
					const newProfile = await this.profileService.create(registerDto)
					// encript token
					const dataToken = {
						email: createUser.data.email,
						role: createUser.data.role
					}
					const tokenRegister = await this.generateToken(dataToken, jwtConfigs.accessTokenExpiresInRegister)
					//send mail
					const linkApi: string = tokenRegister.accessToken
					const mailDto: SendMailDto = {
						linkApi: linkApi,
						email: createUser.data.email,
						createdBy: createUser.data.createdBy,
						template: parseInt(<string>templateConfig.TEMPLATE_REGISTER)
					}
					await this.sendMailRegister(mailDto)
					return new ResponseCommon(201, true, 'REGISTER_SUCCESS')
				}
				return new ResponseCommon(400, false, "EMAIL_IS_EXIST")
			}
			return new ResponseCommon(400, false, "PASSWORD_CONFIRM_INCORRECT", null);
		} catch (error) {
			return new ResponseCommon(400, false, 'BAD_REQUEST', error)
		}
	}

	async sendMailRegister(sendMail: SendMailDto) {
		try {
			new Promise(res => this.queueService.add('send-mail-register', sendMail, { delay: 2000 })
				.then(job => job.finished()
					.then(result => {
						job.remove()
					})))
		} catch (error) {
			console.log(error);
		}
	}

	// Update trang thai ACTIVE cho user
	public async activeUser(token: TokenVerify, email: ConfirmEmailDto): Promise<IResponse> {
		let accessToken = token.token
		let userDecoded: GenerateTokenDto = jwt_decode(accessToken)
		if (userDecoded) {
			const userCheck = await this.userService.findByPayload(userDecoded.email)
			if (userCheck) {
				const userUpdate: UpdateUserDto = {
					status: UserStatus.ACTIVE
				}
				await this.userService.update(userCheck.id, userUpdate)
				return new ResponseCommon(200, true, 'VERIFY_SUCCESS')
			}
		} else {
			return new ResponseCommon(500, false, 'SERVER_ERROR')
		}
	}

	async login(loginUserDto: LoginUserDto): Promise<IResponse> {
		const resultUser = await this.userService.findByLogin(loginUserDto);
		if (!resultUser.success) {
			return resultUser;
		}
		var dataInDb = plainToClass(UserEntity, resultUser.data);
		if (dataInDb.status != UserStatus.ACTIVE) {
			return new ResponseCommon(400, false, "USER_IS_NOT_ACTIVE", null);
		}
		const token = await this.generateToken(dataInDb, jwtConfigs.accessTokenExpiresInLogin)
		const data = {
			email: dataInDb.email,
			token: token.accessToken,
			expressIn: token.expiresIn,
		}
		return new ResponseCommon(200, true, "LOGIN_SUCCESS", data);
	}
	//================Forgot password - Verify =============

	//ham tao token
	async generateToken(dataDto: GenerateTokenDto, expiresIn: string) {
		const { email, role } = dataDto
		const userJwt: JwtPayload = { email, role, expiresIn };
		const accessToken = this.jwtService.sign(userJwt);
		return {
			accessToken: accessToken,
			expiresIn: expiresIn,
		}
	}
	
	// find and send mail for forgot password
	async verifyMailForgotPassword(email: string): Promise<IResponse> {
		const user = await this.userService.findByPayload(email)
		if (user) {
			const dataToken = {
				email: user.email,
				role: user.role
			}
			const tokenForgotPassword = await this.generateToken(dataToken, jwtConfigs.accessTokenExpiresInForgotPassword)
			const linkApi: string = tokenForgotPassword.accessToken
			const mailDto: SendMailDto = {
				linkApi: linkApi,
				email: user.email,
				createdBy: user.createdBy,
				template: parseInt(<string>templateConfig.TEMPLATE_FORGET_PASSWORD)
			}
			await this.sendMailVerifyForgotPassword(mailDto)
			return new ResponseCommon(200, true, 'SEND_MAIL_SUCCESS', linkApi)
		}
		return new ResponseCommon(404, false, 'EMAIL_NOT_FOUND')
	}

	async sendMailVerifyForgotPassword(sendMail: SendMailDto) {
		try {
			new Promise(res => this.queueService.add('send-mail-forgot-password', sendMail, { delay: 2000 })
				.then(job => job.finished()
					.then(result => {
						job.remove()
					})))
		} catch (error) {
			console.log(error);
		}
	}

	async checkTokenForgot(token: TokenVerify): Promise<IResponse> {
		let accessToken = token.token
		let userDecoded: GenerateTokenDto = jwt_decode(accessToken)
		const userCheck = await this.userService.findByPayload(userDecoded.email)
		if (userCheck) {
			return new ResponseCommon(200, true, "VERIFY_SUCCESS")
		}
		return new ResponseCommon(404, false, "VERIFY_FAILED")
	}

	async changePasswordByVerify(token: string, newPassword: string, reNewPassword): Promise<IResponse> {
        if (newPassword === reNewPassword) {
            let userDecoded:GenerateTokenDto = jwt_decode(token)
            const user = await this.userService.findByPayload(userDecoded.email)
            const hashPassword = await bcrypt.hash(newPassword, 10)
            const updatedUser = {
                ...user,
                password: hashPassword
            }
            await this.userService.update(user.id, updatedUser)
            updatedUser.password = undefined
            return new ResponseCommon(200, true, 'CHANGE_PASSWORD_SUCCESS', updatedUser)
        }
    }
	//=================Change password - Otp =============
	async confirmEmail(email: string): Promise<IResponse> {
		const user = await this.userService.findByPayload(email)
		const profile = await this.profileService.getCurrentProfile(user.id)
		if (user) {
			const sendMail: SendMailDto = {
				email: email,
				createdBy: profile.data.firstName + profile.data.lastName,
				template: parseInt(<string>templateConfig.TEMPLATE_OTP_RESET_PASSWORD)
			}
			const otp = await this.generateOTP()
			sendMail.otp = otp
			const res = await this.sendMailOtpForgotPassword(sendMail)
			user.OTP = otp
			await this.userService.update(user.id, user)

			setTimeout(async () => {
				 user.OTP = null;
				 await this.userService.update(user.id,user)
			}, timeConfig.EXPIRESIN_OTP_TIME);
			
			return new ResponseCommon(200, true, 'SEND_EMAIL_SUCCESS', user)
		}
		return new ResponseCommon(404, false, 'EMAIL_NOT_FOUND')
	}
	

	async sendMailOtpForgotPassword(sendMail: SendMailDto) {
		try {
			new Promise(res => this.queueService.add('send-otp-to-mail', sendMail, { delay: 2000 })
				.then(job => job.finished()
					.then(result => {
						job.remove()
					})))
		} catch (error) {
			console.log(error)
		}
	}

	async verifyOtp(inputToken: number, email: string): Promise<IResponse> {
		const user = await this.userService.findByPayload(email)
		if(user.OTP == null) {
			return new ResponseCommon(400, false, 'TOKEN_EXPIRES')
		}
		if (user.OTP == inputToken) {
			return new ResponseCommon(200, true, 'VERIFY_SUCCESS')
		}
		return new ResponseCommon(401, false, 'EMAIL_TOKEN_COMFIRM_INCORRECT')
	}

	async changePasswordByOTP(email: string, newPassword: string, reNewPassword): Promise<IResponse> {
		if (newPassword === reNewPassword) {
			const user = await this.userService.findByPayload(email)
			const hashPassword = await bcrypt.hash(newPassword, 10)

			const updatedUser = {
				...user,
				password: hashPassword
			}
			await this.userService.update(user.id, updatedUser)
			updatedUser.password = undefined
			return new ResponseCommon(200, true, 'CHANGE_PASSWORD_SUCCESS', updatedUser)
		}
	}
	//=============================================
	//resend mail
	async resendMail(email: ConfirmEmailDto) {
		const userCheck = await this.userService.findByPayload(email.email)
		if (userCheck) {
			const dataToken = {
				email: userCheck.email,
				role: userCheck.role
			}
			const tokenRegister = await this.generateToken(dataToken, jwtConfigs.accessTokenExpiresInRegister)
			const linkApi: string = tokenRegister.accessToken
			await this.mail.sendTo(`${hostConfig.APP_URL}/auth/active-user?token=${linkApi}&email=${userCheck.email}`, userCheck.email, userCheck.createdBy, 1)
		}
	}

	// gen otp
	async generateOTP() {
		return otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
	}

}
