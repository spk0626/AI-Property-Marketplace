import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_FILTER } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bull';
import { LoggerModule } from 'nestjs-pino';

import { envValidationSchema } from './config/env.validation';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { PropertiesModule } from './modules/properties/properties.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { AiModule } from './modules/ai/ai.module';
import { JobsModule } from './jobs/jobs.module';

@Module({
  imports: [
   // Config — validates all .env vars at startup
    ConfigModule.forRoot({ 
      isGlobal: true,
      validationSchema: envValidationSchema,
      validationOptions: {abortEarly: true},
  }),

    // Rate limiting 
    ThrottlerModule.forRoot([
      {
        name: 'global',
        ttl: 60_000,
        limit: 100,
      },
      {
        name: 'auth',       // Stricter — prevents brute force on login
        ttl: 60_000,
        limit: 10,
      },
      {
        name: 'ai',         // Gemini limit: 15 RPM
        ttl: 60_000,
        limit: 15,
      },
    ]),

    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        redis: config.getOrThrow<string>('UPSTASH_REDIS_URL'),
        defaultJobOptions: {
          attempts: 3,
          backoff: { type: 'exponential', delay: 2_000 },
          removeOnComplete: 100,
          removeOnFail: 50,
        },
      }),
    }),

    LoggerModule.forRoot({
      pinoHttp: {
        transport: 
          process.env.NODE_ENV === 'production'
          ? {target: 'pino-pretty', options: { colorize: true }}
          : undefined,
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      autoLogging: {
        ignore: (req) => ['/health', '/metrics'].includes(req.url ?? ''),
      },
    },
}),

PrismaModule,
HealthModule,
AuthModule,
PropertiesModule,
BookingsModule,
AiModule,
JobsModule,
],
providers: [
// Global exception filter — handles all errors including Prisma errors
  {
    provide: APP_GUARD,
    useClass: GlobalExceptionFilter,
  },
  // Rate limiter (Throttler) as APP_GUARD to apply globally
  // Without APP_GUARD registration, ThrottlerModule does nothing
  {
    provide: APP_GUARD,
    useClass: ThrottlerGuard,
  },
],
})


export class AppModule {}

// summary:
// 1. imports and configures all other modules (Auth, Properties, Bookings, AI, Jobs)
// 2. Configures global providers like the exception filter and rate limiter guard to apply across the entire application
// 3. Sets up third-party integrations like Bull for job queues and Pino for logging, with environment-based configurations

// AppModule: Root Module that ties everything together