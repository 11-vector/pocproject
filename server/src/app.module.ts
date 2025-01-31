import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { OpenAIModule } from './openai/openai.module';
import { DummyAPIModule } from './dummy-api/dummy-api.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    ProductsModule,
    OpenAIModule,
    DummyAPIModule
  ],
  controllers: [AppController]
})
export class AppModule {} 