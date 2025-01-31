import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { OpenAIModule } from '../openai/openai.module';
import { DummyAPIModule } from '../dummy-api/dummy-api.module';

@Module({
  imports: [OpenAIModule, DummyAPIModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService]
})
export class ProductsModule {} 