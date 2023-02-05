import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { ParameterGetListDTO } from 'src/common/dto/get-all.dto';
import { ResponseCommon } from 'src/common/dto/respone.dto';
import { IResponse } from 'src/common/Interfaces/respone.interface';
import { Response } from 'supertest';
import { DataSource, Repository } from 'typeorm';
import { ProfileEntity } from '../profile/profile.entity';
import { CreateRelationshipDto } from './dto/CreateRelationshipDto.dto';
import { RelationshipEntity } from './entities/relationship.entity';

@Injectable()
export class RelationshipService {
    constructor(
        @InjectRepository(RelationshipEntity)
        private readonly relationshipRepository: Repository<RelationshipEntity>,
    ){}

    async findById(id: string): Promise<IResponse> {
        const relationship = await this.relationshipRepository.findOne({where: {id: id}})
        if(relationship)
            return new ResponseCommon(200, true, "FIND_RELATIONSHIP_SUCCESS", relationship)
        return new ResponseCommon(400, false, "RELATIONSHIP_NOT_FOUND")
    }

    // create a record relationship - thêm liên hệ
    async addFriendInvitation(createRelationshipDto: CreateRelationshipDto): Promise<IResponse> {
        const createRelationship : RelationshipEntity = plainToClass(RelationshipEntity, {
            ...createRelationshipDto
        })
        const dataInsert = await this.relationshipRepository.save(createRelationship)
        if(dataInsert != null) {
            return new ResponseCommon(200, true, "CREATE_RELATIONSHIP_SUCCESS", dataInsert)
        }
        return new ResponseCommon(400, false, "CREATE_RELATIONSHIP_FAILURE")
    }

    // remove a record relationship - hủy kết bạn
    async cancelFriendInvitation(relationshipId: string) {
        await this.relationshipRepository.delete({id: relationshipId})
        const deleteRelationship = await this.relationshipRepository.findOne({where: {id: relationshipId}})
        if(deleteRelationship == null) {
            return new ResponseCommon(200, true, "DELETE_RELATIONSHIP_SUCCESS");
        } 
        return new ResponseCommon(400, false, "DELETE_RELATIONSHIP_FAILURE")
    }

    async acceptAddFriendInvitation(acceptDto: CreateRelationshipDto): Promise<IResponse> {
        const resultRelationship = await this.relationshipRepository
            .createQueryBuilder('relationship')
            .where("relationship.sender_id = :senderId", { senderId: acceptDto.senderId})
            .andWhere("relationship.receiver_id = :receiverId", {receiverId: acceptDto.receiverId})
            .getOne()

        if(resultRelationship) {
            const dataUpdate = await this.relationshipRepository.update(resultRelationship.id, {isFriend: true})
            return new ResponseCommon(200, true, "ACCEPT_ADD_FRIEND_SUCCESS", dataUpdate)
        }
        return new ResponseCommon(400, false, "RELATIONSHIP_NOT_FOUND")
    }    
}
