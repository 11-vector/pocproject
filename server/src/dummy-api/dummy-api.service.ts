import { Injectable, Logger } from '@nestjs/common';
import { Product } from '../products/product.interface';

@Injectable()
export class DummyAPIService {
  private readonly logger = new Logger(DummyAPIService.name);

  async searchAmazon(query: string): Promise<Product[]> {
    return [{
      id: 'dummy-1',
      name: `Amazon ${query}`,
      thumbnail: `https://via.placeholder.com/300x300?text=${query}`,
      price: '$99.99',
      source: 'amazon.com',
      description: `A great ${query} product from Amazon`
    }];
  }

  async searchEbay(query: string) {
    this.logger.log(`Searching eBay for: ${query}`);
    const results = [
      {
        id: 'ebay-1',
        name: `${query} 15 Pro Max (Unlocked)`,
        thumbnail: 'https://via.placeholder.com/150',
        price: '$1,149.99',
        source: 'eBay',
        description: 'Unlocked version with international warranty'
      },
      {
        id: 'ebay-2',
        name: `${query} 15 Pro (Renewed)`,
        thumbnail: 'https://via.placeholder.com/150',
        price: '$949.99',
        source: 'eBay',
        description: 'Certified renewed with warranty'
      },
      {
        id: 'ebay-3',
        name: `${query} 15 (New)`,
        thumbnail: 'https://via.placeholder.com/150',
        price: '$779.99',
        source: 'eBay',
        description: 'Brand new with seller warranty'
      },
      {
        id: 'ebay-4',
        name: `${query} 14 Pro (Unlocked)`,
        thumbnail: 'https://via.placeholder.com/150',
        price: '$899.99',
        source: 'eBay',
        description: 'Previous model unlocked'
      },
      {
        id: 'ebay-5',
        name: `${query} 14 (Renewed)`,
        thumbnail: 'https://via.placeholder.com/150',
        price: '$649.99',
        source: 'eBay',
        description: 'Renewed previous generation'
      }
    ];
    this.logger.log(`Found ${results.length} eBay results`);
    return results;
  }

  async searchWalmart(query: string) {
    this.logger.log(`Searching Walmart for: ${query}`);
    const results = [
      {
        id: 'walmart-1',
        name: `${query} 15 Pro Max 256GB`,
        thumbnail: 'https://via.placeholder.com/150',
        price: '$1,199.99',
        source: 'Walmart',
        description: 'Latest model with extended storage'
      },
      {
        id: 'walmart-2',
        name: `${query} 15 Pro 128GB`,
        thumbnail: 'https://via.placeholder.com/150',
        price: '$999.99',
        source: 'Walmart',
        description: 'Pro model with standard storage'
      },
      {
        id: 'walmart-3',
        name: `${query} 15 128GB`,
        thumbnail: 'https://via.placeholder.com/150',
        price: '$799.99',
        source: 'Walmart',
        description: 'Base model with standard storage'
      },
      {
        id: 'walmart-4',
        name: `${query} 14 Pro 256GB`,
        thumbnail: 'https://via.placeholder.com/150',
        price: '$899.99',
        source: 'Walmart',
        description: 'Previous generation pro model'
      },
      {
        id: 'walmart-5',
        name: `${query} 14 128GB`,
        thumbnail: 'https://via.placeholder.com/150',
        price: '$699.99',
        source: 'Walmart',
        description: 'Previous generation base model'
      }
    ];
    this.logger.log(`Found ${results.length} Walmart results`);
    return results;
  }
} 