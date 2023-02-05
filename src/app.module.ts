/* eslint-disable prettier/prettier */
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { dbConfig, redisConfig } from './common/configs';
import { AuthModule } from './modules/core/auth/auth.module';
import { ProfileModule } from './modules/profile/profile.module';
import { RelationshipModule } from './modules/relationship/relationship.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: <any>dbConfig.DB_TYPE,
      host: dbConfig.DB_HOST,
      port: dbConfig.DB_PORT,
      username: dbConfig.DB_USERNAME,
      password: dbConfig.DB_PASSWORD,
      database: dbConfig.DB_DATABASE,
      entities: ["dist/**/*.entity{.ts,.js}"],
      synchronize: true,
      logging: ["error", "warn", "log"]
    }),
    BullModule.forRoot({
      redis: {
        host: redisConfig.REDIS_HOST,
        port: redisConfig.REDIS_PORT,
        // username: redisConfig.REDIS_CUSTOM_NAME,
        db: 0,
        password: redisConfig.REDIS_PASSWORD,
        // auth_pass: 
      }
    }),
    UsersModule,
    AuthModule,
    ConfigModule.forRoot(),
    ProfileModule,
    RelationshipModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
