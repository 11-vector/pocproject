import { Module } from '@nestjs/common';
import { DummyAPIService } from './dummy-api.service';

@Module({
  providers: [DummyAPIService],
  exports: [DummyAPIService]
})
export class DummyAPIModule {} 