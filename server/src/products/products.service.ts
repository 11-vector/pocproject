import { Injectable, Logger } from '@nestjs/common';
import { OpenAIService } from '../openai/openai.service';
import { DummyAPIService } from '../dummy-api/dummy-api.service';
import { ConfigService } from '@nestjs/config';
import { Product } from './product.interface';
import OpenAI from 'openai';
import axios from 'axios';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    private readonly openAIService: OpenAIService,
    private readonly configService: ConfigService,
    private readonly dummyAPIService: DummyAPIService
  ) {}

  async searchProducts(query: string): Promise<Product[]> {
    this.logger.log(`Searching for products with query: ${query}`);
    let allResults: Product[] = [];
    
    try {
      // Try Google Search API
      const googleApiKey = this.configService.get<string>('GOOGLE_SEARCH_API_KEY');
      const searchEngineId = this.configService.get<string>('GOOGLE_SEARCH_ENGINE_ID');

      if (googleApiKey && searchEngineId) {
        try {
          const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
            params: {
              key: googleApiKey,
              cx: searchEngineId,
              q: `${query} site:amazon.com OR site:bestbuy.com price`,
              num: 10
            }
          });

          if (response.data.items) {
            const googleResults = response.data.items.map(item => ({
              id: item.link,
              name: item.title
                .replace(/- Amazon\.com$/, '')
                .replace(/- Best Buy$/, '')
                .replace(/\s*\|.*$/, '')
                .trim(),
              thumbnail: item.pagemap?.cse_image?.[0]?.src || this.getDefaultImage(query),
              price: this.extractPrice(item.snippet) || 
                     this.extractPrice(item.title) || 
                     this.generateRealisticPrice(query),
              source: new URL(item.link).hostname,
              description: item.snippet,
              rating: item.pagemap?.aggregaterating?.[0]?.ratingvalue || this.generateRandomRating(),
              reviews: item.pagemap?.aggregaterating?.[0]?.reviewcount || Math.floor(Math.random() * 1000)
            }));
            allResults = [...allResults, ...googleResults];
          }
        } catch (error) {
          this.logger.error(`Google Search API error: ${error.message}`);
        }
      }

      // Add fallback results if no results found
      if (allResults.length === 0) {
        allResults = this.generateFallbackResults(query);
      }

      return allResults;
    } catch (error) {
      this.logger.error(`Search error: ${error.message}`);
      return this.generateFallbackResults(query);
    }
  }

  private getDefaultImage(query: string): string {
    return `https://via.placeholder.com/300x300?text=${encodeURIComponent(query)}`;
  }

  private generateRandomRating(): number {
    return Number((3 + Math.random() * 2).toFixed(1)); // Between 3.0 and 5.0
  }

  private extractPrice(text: string): string | null {
    const priceMatch = text.match(/\$\d+(\.\d{2})?/);
    return priceMatch ? priceMatch[0] : null;
  }

  private generateRealisticPrice(query: string): string {
    const basePrice = 50 + Math.floor(Math.random() * 950);
    return `$${basePrice}.99`;
  }

  private generateFallbackResults(query: string): Product[] {
    return Array(5).fill(null).map((_, i) => ({
      id: `generated-${i}`,
      name: `${query} Product ${i + 1}`,
      thumbnail: this.getDefaultImage(query),
      price: this.generateRealisticPrice(query),
      source: 'Generated',
      description: `A high-quality ${query} product with great features.`,
      rating: this.generateRandomRating(),
      reviews: Math.floor(Math.random() * 1000)
    }));
  }

  private generateRealisticResults(query: string, count: number): Product[] {
    // Add realistic product generation logic here
    // This will be used when API limits are reached
    return Array(count).fill(null).map((_, index) => ({
      id: `generated-${index}`,
      name: `${this.generateBrandName()} ${query} ${this.generateModelName()}`,
      thumbnail: this.getDefaultImage(query),
      price: this.generateRealisticPrice(query),
      source: 'Product Search',
      description: this.generateDescription(query),
      rating: this.generateRandomRating(),
      reviews: Math.floor(Math.random() * 1000)
    }));
  }

  private getFallbackResults(query: string) {
    return [
      {
        id: '1',
        name: `${query} - Best Match`,
        thumbnail: 'https://via.placeholder.com/150',
        price: 'Price not available',
        source: 'Search Results',
        description: `Top rated ${query} with great features`
      }
    ];
  }

  private getLaptopImage(): string {
    const laptopImages = [
      'https://m.media-amazon.com/images/I/71TPda7cwUL._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/71jG+e7roXL._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/71tpxt6nwFL._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/71E+KjH7GtL._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/71c5W9NxN5L._AC_SL1500_.jpg'
    ];
    return laptopImages[Math.floor(Math.random() * laptopImages.length)];
  }

  private extractFeatures(text: string): string[] {
    // Split text into sentences and filter out short ones
    return text
      .split(/[.!?]/)
      .map(s => s.trim())
      .filter(s => s.length > 10)
      .slice(0, 5); // Limit to 5 features
  }

  private extractBrand(title: string): string {
    const commonBrands = ['Apple', 'Samsung', 'Sony', 'LG', 'Google', 'Microsoft', 'Dell', 'HP', 'Lenovo', 'Asus'];
    for (const brand of commonBrands) {
      if (title.toLowerCase().includes(brand.toLowerCase())) return brand;
    }
    return 'Brand not specified';
  }

  private extractModel(title: string): string {
    // Remove the brand name and clean up the remaining text
    const brand = this.extractBrand(title);
    return title
      .replace(brand, '')
      .trim()
      .split(' ')
      .slice(0, 3)
      .join(' ');
  }

  private generateBrandName(): string {
    const brands = [
      'Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'MSI', 
      'Apple', 'Samsung', 'Microsoft', 'LG', 'Toshiba'
    ];
    return brands[Math.floor(Math.random() * brands.length)];
  }

  private generateModelName(): string {
    const series = ['Pro', 'Elite', 'Ultra', 'Plus', 'Max', 'Air'];
    const year = new Date().getFullYear();
    const model = Math.floor(Math.random() * 9000) + 1000;
    return `${series[Math.floor(Math.random() * series.length)]} ${model} (${year})`;
  }

  private generateDescription(query: string): string {
    const descriptions = [
      `High-performance ${query} with latest technology`,
      `Premium ${query} designed for professionals`,
      `Powerful ${query} with exceptional features`,
      `Best-selling ${query} with great value`,
      `Advanced ${query} for demanding users`
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }

  private getLaptopImages(): string[] {
    return [
      'https://m.media-amazon.com/images/I/71TPda7cwUL._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/71jG+e7roXL._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/71tpxt6nwFL._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/71E+KjH7GtL._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/71c5W9NxN5L._AC_SL1500_.jpg'
    ];
  }

  private getProductImages(query: string): string[] {
    switch (query.toLowerCase()) {
      case 'laptop':
        return this.getLaptopImages();
      default:
        return Array(5).fill('https://via.placeholder.com/800');
    }
  }

  async getProductDetails(id: string) {
    this.logger.log(`Getting details for product ID: ${id}`);
    try {
      // If it's a generated product ID, return generated details
      if (id.startsWith('generated-')) {
        const query = id.split('-')[1];
        const images = this.getProductImages(query);
        return {
          ...this.generateRealisticResults(query, 1)[0],
          images: images,
          specifications: {
            Brand: this.generateBrandName(),
            Model: this.generateModelName(),
            'Release Year': new Date().getFullYear(),
            'Condition': 'New',
            'Availability': 'In Stock'
          }
        };
      }

      // First try to fetch the original product data
      const googleApiKey = this.configService.get<string>('GOOGLE_SEARCH_API_KEY');
      const searchEngineId = this.configService.get<string>('GOOGLE_SEARCH_ENGINE_ID');

      if (googleApiKey && searchEngineId) {
        try {
          // Use the ID (which is the URL) to get more details
          const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
            params: {
              key: googleApiKey,
              cx: searchEngineId,
              q: id,
              num: 1
            }
          });

          if (response.data.items?.[0]) {
            const item = response.data.items[0];
            const source = new URL(id).hostname;
            
            return {
              id: id,
              name: item.title,
              thumbnail: item.pagemap?.cse_image?.[0]?.src || 'https://via.placeholder.com/150',
              price: this.extractPrice(item.snippet) || 'Price not available',
              source: source,
              description: item.snippet,
              specifications: {
                Brand: this.extractBrand(item.title),
                Model: this.extractModel(item.title),
                'Product URL': id,
                'Seller': source,
                'Condition': 'New',
                'Availability': 'In Stock'
              },
              features: this.extractFeatures(item.snippet),
              images: [
                item.pagemap?.cse_image?.[0]?.src || 'https://via.placeholder.com/800',
                ...(item.pagemap?.cse_thumbnail || []).map(thumb => thumb.src),
                ...Array(3).fill('https://via.placeholder.com/800')
              ].filter(Boolean).slice(0, 5)
            };
          }
        } catch (error) {
          this.logger.error(`Google Search API error: ${error.message}`);
        }
      }

      // Fallback to OpenAI for enhanced details
      try {
        const completion = await this.openAIService.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a product details assistant. Generate detailed product information including specifications and features."
            },
            {
              role: "user",
              content: `Generate detailed product information for: ${id}. Include realistic specifications, features, and pricing.`
            }
          ]
        }) as OpenAI.Chat.ChatCompletion;

        const content = JSON.parse(completion.choices[0].message.content);
        return {
          id: id,
          ...content,
          images: Array(5).fill(content.thumbnail || 'https://via.placeholder.com/800')
        };
      } catch (error) {
        this.logger.error(`OpenAI API error: ${error.message}`);
      }

      // Final fallback to mock data
      return {
        id: id,
        name: `Product Details for ${id}`,
        thumbnail: 'https://via.placeholder.com/800',
        price: 'Price not available',
        source: new URL(id).hostname,
        description: 'Detailed product information not available at the moment.',
        specifications: {
          'Brand': 'Brand information unavailable',
          'Model': 'Model information unavailable',
          'Product URL': id
        },
        features: [
          'Feature information currently unavailable',
          'Please check back later for updated details'
        ],
        images: Array(5).fill('https://via.placeholder.com/800')
      };

    } catch (error) {
      this.logger.error(`Product details error: ${error.message}`);
      throw new Error('Failed to load product details');
    }
  }

  private getMockProducts(query: string): Product[] {
    return [
      {
        id: '1',
        name: `${query} - Premium Version`,
        thumbnail: 'https://via.placeholder.com/300',
        price: '$999.99',
        source: 'Product Search',
        description: `High-quality ${query} with premium features`,
        specifications: {
          'Brand': 'Premium Brand',
          'Model': '2024 Edition'
        },
        features: [
          'Premium quality',
          'Latest technology',
          '1-year warranty'
        ],
        images: Array(5).fill(null).map((_, i) => 
          `https://via.placeholder.com/800?text=Product+Image+${i + 1}`
        )
      }
    ];
  }

  // Update OpenAI prompt to get more results
  async enhanceSearch(query: string) {
    try {
      const completion = await this.openAIService.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a product search assistant. Return a JSON array of 10 relevant products with realistic details including name, price, description, and specifications."
          },
          {
            role: "user",
            content: `Generate detailed product search results for: ${query}. Include variety in prices and features.`
          }
        ]
      }) as OpenAI.Chat.ChatCompletion;

      const content = completion.choices[0].message.content;
      return JSON.parse(content);
    } catch (error) {
      this.logger.error(`OpenAI API error: ${error.message}`);
      return null;
    }
  }

  private async enrichProductData(product) {
    try {
      // Try to get more details using OpenAI
      const completion = await this.openAIService.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a product details assistant. Generate missing product information in JSON format."
          },
          {
            role: "user",
            content: `Enhance this product information with realistic details:
              Name: ${product.name}
              Description: ${product.description}
              Generate: price (if missing), key features, and specifications.
              Return only the missing information, keeping existing data intact.`
          }
        ]
      }) as OpenAI.Chat.ChatCompletion;

      const enhancedData = JSON.parse(completion.choices[0].message.content);
      
      // Keep existing data, only add missing information
      return {
        ...product,
        price: product.price || enhancedData.price || 'Price not available',
        features: product.features || enhancedData.features || [],
        specifications: {
          ...enhancedData.specifications,
          ...product.specifications,
        }
      };
    } catch (error) {
      this.logger.error(`Failed to enrich product data: ${error.message}`);
      // Return original product data if enhancement fails
      return product;
    }
  }
}
