import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { diskStorage } from 'multer';
import { jwtConfigs } from 'src/common/configs';
import { uploadFilesDir } from 'src/common/constants';
import { editFileName } from 'src/common/utils/file-upload.util';
import { RelationshipModule } from '../relationship/relationship.module';
import { ProfileEntity } from './profile.entity';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
    imports: [
		TypeOrmModule.forFeature([ProfileEntity]),
		PassportModule.register({ defaultStrategy: 'jwt' }),
		JwtModule.register({
			secretOrPrivateKey: jwtConfigs.secret,
			signOptions: { expiresIn: jwtConfigs.accessTokenExpiresInLogin },
		}),
		MulterModule.register({
			storage: diskStorage({
				destination: `${uploadFilesDir}/file`,
				filename: editFileName,
			}),
			limits: {
				fileSize: 10000000 // 10MB
			}
		}),
		RelationshipModule
    ],
    controllers: [ProfileController],
    providers: [ProfileService],
    exports: [ProfileService],
})
export class ProfileModule {}
