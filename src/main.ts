import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import { configurations } from 'src/common/configs';
import { LoggingInterceptor } from 'src/common/interceptors/logging.interceptor';
import { AppModule } from './app.module';
import rateLimit = require('express-rate-limit');

function applyMiddileWare(app: NestExpressApplication, configService: ConfigService): void {
  app.use(compression());
  // app.use(helmet);
  app.enableCors();
  // giới hạn số lần rq trong 1 khoản thời gian với 1 ip
  if (configurations.nodeEnv === 'production') {
    app.use(
      rateLimit.rateLimit({
        windowMs:configurations.rateLimitWindow, // 15 minutes
        max: configurations.rateLimitMaxRquest, // limit each IP requests per windowMs
      })
    );
  }
}

function initialSwagger(app: NestExpressApplication): void {
  const options = new DocumentBuilder()
    .setTitle('ECard API Document')
    .setDescription('The document about list of API for ECard')
    .setVersion('1.0')
    .setContact('LeVanToan', 'https://www.linkedin.com/in/toan-le-9a6499193/', 'lvtoan.it2000@gmail.com')
    .addBasicAuth()
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get<ConfigService>(ConfigService);

  /**
   * Applying middleware
   */
  applyMiddileWare(app, configService);
  initialSwagger(app);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      validationError: {
        target: false
      }
    }),
  );
  app.useGlobalInterceptors(new LoggingInterceptor());

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  // await app.listen(3000);
  await app.listen(configurations.port);

  console.log(`
  =============================================
    
  Server is running on: ${await app.getUrl()} 
  
  =============================================
  `);
}



bootstrap();
