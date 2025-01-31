import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { ProductsService } from '../products/products.service';
import { OpenAIService } from '../openai/openai.service';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'GOOGLE_SEARCH_API_KEY':
                  return process.env.GOOGLE_SEARCH_API_KEY;
                case 'GOOGLE_SEARCH_ENGINE_ID':
                  return process.env.GOOGLE_SEARCH_ENGINE_ID;
                default:
                  return null;
              }
            }),
          },
        },
        {
          provide: OpenAIService,
          useValue: {
            enhanceSearch: jest.fn().mockResolvedValue('enhanced query'),
          },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should search products', async () => {
    const results = await service.searchProducts('test product');
    expect(Array.isArray(results)).toBeTruthy();
  });
}); 