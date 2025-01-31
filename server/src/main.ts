import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  
  // Configure CORS
  app.enableCors({
    origin: true, // Allow all origins for now
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  const port = 3002;
  await app.listen(port);
  logger.log(`Server running on http://localhost:${port}`);
}
bootstrap();
