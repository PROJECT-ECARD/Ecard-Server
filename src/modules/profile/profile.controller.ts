import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Res, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { ParameterGetListDTO } from 'src/common/dto/get-all.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { IResponse } from 'src/common/Interfaces/respone.interface';
import { imageFileFilter } from 'src/common/utils/file-upload.util';
import { UserEntity } from '../users/entities/user.entity';
import { GenerateQrCodeDto } from './dto/gen-qrcode.dto';
import { UpdateQrDto } from './dto/update-qr.dto';
import { UpdateCurrentProfileDTO } from './dto/updateCurrentUserProfile.dto';
import { ProfileService } from './profile.service';

@Controller('profile')
@ApiTags('Profile')
@ApiBearerAuth()
@UseGuards(AuthGuard(), RolesGuard)
export class ProfileController {
    constructor(private readonly profileService:ProfileService ) {}

    @HttpCode(HttpStatus.OK)
	@ApiOperation({summary: 'get me'})
	@Get('/me')
	async me(@CurrentUser() user: UserEntity): Promise<IResponse> {
		return this.profileService.getCurrentProfile(user.id);
	}

    @HttpCode(HttpStatus.OK)
    @ApiOperation({summary: 'get profile by id'})
    @Get('/:userId')
    async findById(@Param("userId") userId: string): Promise<IResponse> {
        return this.profileService.findById(userId)
    }    

    @HttpCode(HttpStatus.OK)
	@ApiOperation({summary: 'Get list friend profile user'})
    @Get('getListFriend/:profileId')
    async getListFriend(@Param("profileId") profileId:string) :Promise<IResponse>{
        return this.profileService.getListFriend(profileId)
    }

    @HttpCode(HttpStatus.OK)
    @ApiOperation({summary: 'generate qr code'})
    @Post('/generate-qrcode')
    async generateQRCode(@Body() genQrDto: GenerateQrCodeDto): Promise<IResponse> {
        return this.profileService.generageQRCode(genQrDto)
    }

    @HttpCode(HttpStatus.OK)
    @ApiOperation({summary: 'update qr code'})
    @Post('/update-qrcode')
    async updateQRCode(@Body() updateQrDto: UpdateQrDto): Promise<IResponse> {
        return this.profileService.updateQRCode(updateQrDto.id)
    }

    @HttpCode(HttpStatus.OK)
    @ApiOperation({summary:'find something profile'})
    @Post('/get-profile')
    async findProfile(@Body() propsGet:ParameterGetListDTO){
        return this.profileService.getProfile(propsGet)
    }

    @HttpCode(HttpStatus.OK)
	@ApiOperation({summary: 'update profile'})
    @ApiConsumes('multipart/form-data')
	@Post('/update-profile')
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'avatar'},
            { name: 'coverImage'}
        ], 
        {
            fileFilter: imageFileFilter,
        }))
	async updateProfile(@CurrentUser() user: UserEntity,@Body() profileDto: UpdateCurrentProfileDTO, @UploadedFiles() files: {avatar?: Express.Multer.File[], coverImage?: Express.Multer.File[]}): Promise<IResponse> {
        if(files.avatar && files.avatar[0].path) {
            profileDto.avatar = files.avatar[0].path
        } else {
            profileDto.avatar = ''
        }
        if(files.coverImage && files.coverImage[0].path) {
            profileDto.coverImage = files.coverImage[0].path
        } else {
            profileDto.coverImage = ''
        }
        
		return this.profileService.updateProfile(user.id,profileDto);
	}

    @HttpCode(HttpStatus.OK)
	@ApiOperation({summary: 'find file from path of image'})
    @Get('upload/file/:imgpath')
    async serveFileDocumentUploaded(@Param('imgpath') imgpath: string, @Res() res: Response): Promise<any> {
        return res.sendFile(imgpath.trim(), { root: './'})
    }

    // @HttpCode(HttpStatus.OK)
	// @ApiOperation({summary: 'Get list friend'})
    // @Get('get-list-friend/:profileId')
    // async getListFriend(@Param('profileId') profileId: string): Promise<IResponse> {
    //     return this.profileService.getListFriend(profileId)
    // }

}
