/* eslint-disable prettier/prettier */
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Redirect, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IResponse } from 'src/common/Interfaces/respone.interface';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
import { LoginUserDto } from './dto/in-login.dto';
import { RegisterDto } from './dto/in-register.dto';
import { TokenVerify } from './dto/token.dto';
import { VerifyEmailTokenDTO } from './dto/verify-email-token.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @ApiOperation({summary: 'seed admin'})
    @Post('/seed-admin')
    async seed(): Promise<IResponse> {
        return await this.authService.seedAdmin()
    }

    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create account' })
    @Post('/register')
    public async register(@Body() registerDto: RegisterDto) : Promise<IResponse> {
        return await this.authService.register(registerDto);
    }

    // xac thuc tai khoan
    @HttpCode(HttpStatus.OK)
    @ApiOperation({summary:'active user'})
    @Get('/active-user')
    public async verifyMail(@Query() token:TokenVerify,@Query() email) {  
        return await this.authService.activeUser(token,email)
    }
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Login' })
    @UseGuards(LocalAuthGuard)
    @Post('/login')
    public async login(@Body() loginUserDto: LoginUserDto): Promise<IResponse> {
        return await this.authService.login(loginUserDto);
    }

    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Confirm email to send otp' })
    @Post('/confirm-email')
    public async confirmEmailOtp(@Body() confirm: ConfirmEmailDto): Promise<IResponse> {
        return await this.authService.confirmEmail(confirm.email)
    } 

    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Check otp have true' })
    @Post('/verify-otp')
    public async verifyOtp(@Body() verifyDto: VerifyEmailTokenDTO): Promise<IResponse> {
        return await this.authService.verifyOtp(verifyDto.inputToken, verifyDto.email)
    } 

    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Change password by otp' })
    @Post('/change-password-by-otp')
    public async changePasswordByOtp(@Body() changePasswordDto: ChangePasswordDto): Promise<IResponse> {
        return await this.authService.changePasswordByOTP(changePasswordDto.email, changePasswordDto.newPass, changePasswordDto.reNewPass)
    } 

    //gui mail quen pass
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Verify mail forgot password' })
    @Post('/verify-mail-forgot-password')
    public async verifyMailForgotPassword(@Body() confirmEmail: ConfirmEmailDto): Promise<IResponse>{
        return await this.authService.verifyMailForgotPassword(confirmEmail.email)
    } 

    @ApiOperation({summary:'update status'})
    @Get('/verify-resetpass')
    public async checkToken (@Query() token:TokenVerify): Promise<IResponse> {        
        return await this.authService.checkTokenForgot(token)
    }

    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Change password by verify' })
    @Post('/change-password-by-verify')
    public async changePasswordByVerify(@Body() changePasswordDto: ChangePasswordDto): Promise<IResponse> {
        return await this.authService.changePasswordByVerify(changePasswordDto.token,changePasswordDto.newPass,changePasswordDto.reNewPass)
    } 
}
