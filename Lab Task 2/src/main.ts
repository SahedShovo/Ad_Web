import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove fields not in DTO
      forbidNonWhitelisted: true, // Throw error for unknown fields
      transform: true, // Auto-convert types (e.g. string to number)
    }),
  );

  await app.listen(3005);
  console.log('Application is running on: http://localhost:3005');
}
bootstrap();
