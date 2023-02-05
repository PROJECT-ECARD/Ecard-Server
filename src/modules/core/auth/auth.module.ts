import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtConfigs } from 'src/common/configs';
import Mail from 'src/common/templates/send-mail.template';
import { ProfileModule } from 'src/modules/profile/profile.module';
import { UsersModule } from 'src/modules/users/users.module';
import { AuthConsumer } from './auth.consumer';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
    imports: [
        UsersModule,
        ProfileModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secretOrPrivateKey: jwtConfigs.secret,
            signOptions: { expiresIn: jwtConfigs.accessTokenExpiresInRegister },
        }),
        BullModule.registerQueue({
            name: 'email-queue'
        })
    ],
    controllers: [AuthController],
    providers: [AuthService, AuthConsumer, LocalStrategy, JwtStrategy, Mail],
    exports: [AuthService]
})
export class AuthModule {}
