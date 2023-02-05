import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { ParameterGetListDTO } from 'src/common/dto/get-all.dto';
import { ResponseCommon } from 'src/common/dto/respone.dto';
import { IResponse } from 'src/common/Interfaces/respone.interface';
import { Like, Repository } from 'typeorm';
import { RegisterDto } from '../core/auth/dto/in-register.dto';
import { RelationshipEntity } from '../relationship/entities/relationship.entity';
import { RelationshipService } from '../relationship/relationship.service';
import { GenerateQrCodeDto } from './dto/gen-qrcode.dto';
import { UpdateCurrentProfileDTO } from './dto/updateCurrentUserProfile.dto';
import { ProfileEntity } from './profile.entity';
const QRCode = require('qrcode')

@Injectable()
export class ProfileService {
	constructor(@InjectRepository(ProfileEntity)
		private readonly profileRepository: Repository<ProfileEntity>,
		private readonly relationshipService: RelationshipService
	){}


	async getCurrentProfile(userId: string): Promise<IResponse> {
		const currentProfile = await this.profileRepository.createQueryBuilder('profile')
			.leftJoinAndSelect('profile.user','user')
			.where('profile.user=:userId',{userId})
			.getOne()
		if (!currentProfile)
		{
			return new ResponseCommon(404, false, "USER_NOT_FOUND", null);
		}
		return new ResponseCommon(200, true, "GET_ME_SUCCESS",currentProfile);
	}

	async findById(userId: string): Promise<IResponse>{
		const profile = await this.profileRepository.findOne({where: {id: userId}})
		if(profile)
			return new ResponseCommon(200, true, 'FIND_USER_SUCCESS', profile)
		return new ResponseCommon(400, false, 'USER_NOT_FOUND')
	}

 	 async create(registerDto: RegisterDto): Promise<IResponse>{
      const dataInsert = await plainToClass(ProfileEntity, {
        user: registerDto.user,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        phoneNumber: registerDto.phoneNumber,
		isDelete: false
      })

	const resultInsert = await this.profileRepository.save(dataInsert)
	const genQrDto: GenerateQrCodeDto = {
		id: resultInsert.id,
		updatedDate: new Date()
	}
	const qr = await this.generageQRCode(genQrDto)
	await this.profileRepository.update(resultInsert.id,{qrCode:qr.data})
      if(resultInsert)
        return new ResponseCommon(201, true, 'CREATE_PROFILE_SUCCESS', resultInsert)
      return new ResponseCommon(500, false, 'SERVER_ERROR')
    
  }

	async generageQRCode(genQrDto: GenerateQrCodeDto): Promise<IResponse>{
		const generageQR = async text => {
			try{
				return await QRCode.toDataURL(text)
			}catch(err){
				return err
			}
		}
		const qrcode = await generageQR(JSON.stringify(genQrDto))
		if(qrcode)
			return new ResponseCommon(201, true, 'GENERATE_QRCODE_SUCCESS', qrcode)
		return new ResponseCommon(400, false, 'GENERATE_QRCODE_FAIL')
	}

	async updateQRCode(id: string): Promise<IResponse>{
		const profile = await this.profileRepository.findOne({where: {id: id}})
		const genQrDto: GenerateQrCodeDto = {
			id: profile.id,
			updatedDate: new Date()
		}
		const qrUpdate = await this.generageQRCode(genQrDto)
		profile.qrCode = qrUpdate.data
		await this.profileRepository.update(id, profile)
		return new ResponseCommon(200, true, 'UPDATE_QRCODE_SUCCESS')
	}

	//delete profile
	async deleteProfile (userId:string){
		const profileDelete = await this.profileRepository.createQueryBuilder('profile')
			.leftJoinAndSelect('profile.user','user')
			.where('profile.user=:userId',{userId})
			.getOne()

			if(profileDelete) {
				
			}
			await this.profileRepository.update(profileDelete.id,{isDelete:true})
	}

	async getProfile(propsGet:ParameterGetListDTO):Promise<IResponse>{
		let profiles: any; // danh sach profile
        let skip; // bo qua bao nhieu phan tu
        let take = propsGet.pageSize; // lay bao nhieu phan tu

        if (propsGet.isDropdown) {
            profiles = await this.profileRepository.find({where:{isDelete:false}});
        } else {
			if (propsGet.searchValue) {
				// tim kiem theo bussiness
				let searchValue = propsGet.searchValue;
				profiles = await this.profileRepository.find({
					where:[ 
							{businessName:Like(`%${searchValue}%`) ,isDelete:false},
							{firstName:Like(`%${searchValue}%`) ,isDelete:false},
							{lastName:Like(`%${searchValue}%`) ,isDelete:false}
						],
				});
			}
			// if (take) {
			// 	if (!propsGet.skip) {
			// 		skip = 0;
			// 	}else{
			// 		skip = propsGet.skip
			// 	}
			// 	await this.profileRepository
			// 		.findAndCount({ take, skip,where:{isDelete:false} })
			// 		.then(([profile]) => {
			// 			profiles = profile;
			// 	});
			// }
			// orderby ASC sap xep theo abc, DESC sap xep theo cba
			if(propsGet.orderBy){
				let type = propsGet.orderBy
				if(type==='ASC'){
					profiles = await this.profileRepository.find({order:{firstName:'ASC'},where:{isDelete:false}})
				}else{
					profiles = await this.profileRepository.find({order:{firstName:'DESC'},where:{isDelete:false}})
				}
			}
        }
        return new ResponseCommon(200, true, 'GET_All_PROFILE_SUCCESS', profiles);
	}

	//update profile by current user
	async updateProfile(userId: string,profileDTO:UpdateCurrentProfileDTO): Promise<IResponse> {
		const currentProfile = await this.profileRepository.createQueryBuilder('profile')
			.leftJoinAndSelect('profile.user','user')
			.where('profile.user=:userId',{userId})
			.getOne()

			profileDTO.id = currentProfile.id   //set id profile de update		
			profileDTO.updatedBy = currentProfile.id
			const updatedProfile = await this.profileRepository.update(currentProfile.id,profileDTO)
		if (!currentProfile)
		{
			return new ResponseCommon(404, false, "USER_NOT_FOUND", null);
		}
		return new ResponseCommon(200, true, "UPDATE_PROFILE_SUCCESS",updatedProfile);
	}

	async getListFriend(profileId: string):Promise<IResponse>{
		const profile = await this.profileRepository.createQueryBuilder('profile')
			.leftJoinAndSelect('profile.listSenders', 'listSenders')
			.where("profile.id = :profileId",{profileId})
			.getOne()

		let listFriend = []
		if(profile) {
			const relationshipSenders: RelationshipEntity[] =  profile.listSenders
			relationshipSenders.forEach(async (f) => {
			 	if(f.isFriend) {
			 		let response = await this.relationshipService.findById(f.id)
			 		let relationshipSend =  response.data
			 		let friendProfile =  relationshipSend.receiverId
					console.log("aaaaaaaa: ", friendProfile);
					let idProfile = friendProfile
					listFriend.push(friendProfile)
			 		console.log("bbbbb: ", listFriend);
			 	}
			 })
			 
			relationshipSenders.map(async(sender)=>{
				if(sender.isFriend) {
					let response = await this.relationshipService.findById(sender.id)
					let relationshipSend =  response.data
					let friendProfile =  relationshipSend.receiverId					
				}
			})
			console.log("bbbbb: ", listFriend);
			return new ResponseCommon(200, true, "ALL_FRIEND", listFriend)
		}
		return new ResponseCommon(400, false, "FAILURE")
	}
}
