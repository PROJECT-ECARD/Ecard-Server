import { Body, Controller, HttpCode, HttpStatus, Param, Post,Get } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ParameterGetListDTO } from 'src/common/dto/get-all.dto';
import { IResponse } from 'src/common/Interfaces/respone.interface';
import { CreateRelationshipDto } from './dto/CreateRelationshipDto.dto';
import { RelationshipService } from './relationship.service';

@Controller('relationship')
@ApiTags('Realtionship')
export class RelationshipController {
    constructor(
        private readonly relationshipService: RelationshipService
    ) {}

    @HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Get information relationship' })
	@Get('/:relationshipId')
	async getDetailRelationship(@Param('relationshipId') relationshipId: string): Promise<IResponse> {
		return this.relationshipService.findById(relationshipId)
	}

    @HttpCode(HttpStatus.OK)
    @ApiOperation({summary: 'Send add friend invitation'})
    @Post("/add-friend-invitation")
    async addFriendInvitation(@Body() createRelationshipDto: CreateRelationshipDto): Promise<IResponse> {
        return await this.relationshipService.addFriendInvitation(createRelationshipDto)
    }

    @HttpCode(HttpStatus.OK)
    @ApiOperation({summary: 'Cancel add friend invitation'})
    @Post("/cancel-friend-invitation/:id")
    async cancelFriendInvitation(@Param('id') id: string): Promise<IResponse> {
        return await this.relationshipService.cancelFriendInvitation(id)
    }

    @HttpCode(HttpStatus.OK)
    @ApiOperation({summary: 'Accept add friend invitation'})
    @Post("/accept-add-friend-invitation")
    async acceptAddFriendInvitation(@Body() acceptDto: CreateRelationshipDto ): Promise<IResponse> {
        return await this.relationshipService.acceptAddFriendInvitation(acceptDto)
    }
}
