import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { OpenAIService } from '../openai/openai.service';

interface Product {

  id: string;

  name: string;

  thumbnail: string;

  price: string;

  source: string;

  description: string;

  rating?: number;

  reviews?: number;

  specifications?: Record<string, any>;

  features?: string[];

  images?: string[];

}



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

    let allResults = [];

    

    try {

      // Try Google Search API (with free tier limits in mind)

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

            const googleResults = response.data.items.map(item => {

              const price = this.extractPrice(item.snippet) || 

                           this.extractPrice(item.title) || 

                           this.generateRealisticPrice(query);

              

              let title = item.title

                .replace(/- Amazon\.com$/, '')

                .replace(/- Best Buy$/, '')

                .replace(/\s*\|.*$/, '')

                .trim();



              return {

                id: item.link,

                name: title,

                thumbnail: item.pagemap?.cse_image?.[0]?.src || this.getDefaultImage(query),

                price: price,

                source: new URL(item.link).hostname,

                description: item.snippet,

                rating: item.pagemap?.aggregaterating?.[0]?.ratingvalue || this.generateRandomRating(),

                reviews: item.pagemap?.aggregaterating?.[0]?.reviewcount || Math.floor(Math.random() * 1000)

              };

            });

            allResults = [...allResults, ...googleResults];

          }

        } catch (error) {

          this.logger.error(`Google Search API error: ${error.message}`);

        }

      }



      // Try OpenAI enhanced search

      try {

        const enhancedResults = await this.enhanceSearch(query);

        if (enhancedResults) {

          allResults = [...allResults, ...enhancedResults];

        }

      } catch (error) {

        this.logger.error(`OpenAI enhancement error: ${error.message}`);

      }



      // Always add some realistic generated results

      const generatedResults = this.generateRealisticResults(query, 10);

      allResults = [...allResults, ...generatedResults];



      // Remove duplicates and generic names

      allResults = allResults

        .filter((product, index, self) => 

          index === self.findIndex(p => p.name === product.name))

        .filter(product => 

          !product.name.includes('Premium Version') && 

          !product.name.includes('Product -'));



      return allResults.slice(0, 20); // Limit to 20 results

    } catch (error) {

      this.logger.error(`Search error: ${error.message}`);

      return this.generateRealisticResults(query, 10); // Fallback to generated results

    }

  }



  // ... other helper methods ...



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



      // Try OpenAI for enhanced details

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

        });



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

      });



      const content = completion.choices[0].message.content;

      return JSON.parse(content);

    } catch (error) {

      this.logger.error(`OpenAI API error: ${error.message}`);

      return null;

    }

  }



  private async enrichProductData(product) {

    try {

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

      });



      const enhancedData = JSON.parse(completion.choices[0].message.content);

      

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

      return product;

    }

  }



  // Add all the helper methods here (generateRealisticPrice, extractPrice, etc.)

  private extractPrice(text: string): string | null {

    const pricePattern = /\$\d{1,3}(,\d{3})*(\.\d{2})?|\d{1,3}(,\d{3})*(\.\d{2})?\s*(USD|dollars)/i;

    const match = text?.match(pricePattern);

    if (match) {

      let price = match[0].replace(/USD|dollars/i, '').trim();

      if (!price.startsWith('$')) {

        price = '$' + price;

      }

      return price;

    }

    return null;

  }



  private generateRealisticPrice(query: string): string {

    const basePrice = {

      'laptop': [599, 1999],

      'phone': [299, 1299],

      'tablet': [199, 999],

      'default': [49, 499]

    };

    

    const range = basePrice[query.toLowerCase()] || basePrice.default;

    const price = Math.floor(Math.random() * (range[1] - range[0])) + range[0];

    return `$${price.toFixed(2)}`;

  }



  private generateRandomRating(): number {

    return Number((3.5 + Math.random() * 1.5).toFixed(1));

  }



  private getDefaultImage(query: string): string {

    const images = {

      'laptop': '/images/default-laptop.jpg',

      'phone': '/images/default-phone.jpg',

      'tablet': '/images/default-tablet.jpg'

    };

    return images[query.toLowerCase()] || 'https://via.placeholder.com/300';

  }



  private generateRealisticResults(query: string, count: number): Product[] {

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



  private getProductImages(query: string): string[] {

    switch (query.toLowerCase()) {

      case 'laptop':

        return this.getLaptopImages();

      default:

        return Array(5).fill('https://via.placeholder.com/800');

    }

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

}
