import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RelationshipEntity } from './entities/relationship.entity';
import { RelationshipController } from './relationship.controller';
import { RelationshipService } from './relationship.service';

@Module({
	imports: [TypeOrmModule.forFeature([RelationshipEntity])],
	controllers: [RelationshipController],
	providers: [RelationshipService],
	exports: [RelationshipService]
})
export class RelationshipModule {}
