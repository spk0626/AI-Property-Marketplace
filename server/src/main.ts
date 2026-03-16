import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService} from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {bufferLogs: true});

  app.useLogger(app.get(Logger));  // Use the Pino logger globally

  const config = app.get(ConfigService);

  // All routes live under /api
  // Health and metrics are at root level via HealthController
  app.setGlobalPrefix('api', {
    exclude: [ 'health', 'metrics' ],  // exclude health and metrics endpoints from global prefix
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,  // Strip properties that do not have decorators
      forbidNonWhitelisted: true,  // Throw an error if non-whitelisted properties are present
      transform: true,  // Automatically transform payloads to DTO instances
      transformOptions: { enableImplicitConversion: true },  // Allow implicit type conversion (e.g., string to number)
    }),
  );

  app.enableCors({
    origin: config.get<string>('CLIENT_URL') ?? 'http://localhost:3000',
    credentials: true,
  });

  const port = config.get<number>('PORT') ?? 5000;
  await app.listen(port);

  app.get(Logger).log(`Server is running on port ${port}`);
}

bootstrap();

// main.ts: the entry point of the NestJS application

// 1. Creates the Nest application instance using the AppModule
// 2. Configures global middleware and settings (like validation, CORS, logging)
// 3. Starts the server and listens on the specified port
