import 'dotenv/config'; // Must be first — Prisma 7 no longer auto-loads .env
import * as dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug'],
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3001);
  const clientUrl = configService.get<string>('CLIENT_URL', 'http://localhost:3000');

  // Security
  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());

  // CORS
  app.enableCors({
    origin: [clientUrl, 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger (dev only)
  if (configService.get('NODE_ENV') !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('ClubSync API')
      .setDescription('College Event Management Platform API')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('auth', 'Authentication')
      .addTag('clubs', 'Club Management')
      .addTag('events', 'Event Management')
      .addTag('registrations', 'Registration & Ticketing')
      .addTag('checkin', 'Check-in System')
      .addTag('analytics', 'Analytics')
      .addTag('ai', 'AI Features')
      .addTag('notifications', 'Notifications')
      .addTag('users', 'User Management')
      .addTag('admin', 'Admin')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });
    Logger.log(`Swagger docs at http://localhost:${port}/api/docs`);
  }

  await app.listen(port);
  Logger.log(`ClubSync backend running on http://localhost:${port}/api/v1`);
}

bootstrap();
