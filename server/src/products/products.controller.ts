import { Controller, Get, Query, Param, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('api/products')
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);
  
  constructor(private readonly productsService: ProductsService) {}

  @Get('search')
  async searchProducts(@Query('q') query: string) {
    this.logger.log(`Searching for products with query: ${query}`);
    return this.productsService.searchProducts(query);
  }

  @Get('products/:id')
  async getProductDetails(@Param('id') id: string) {
    this.logger.log(`Getting details for product: ${id}`);
    try {
      return await this.productsService.getProductDetails(id);
    } catch (error) {
      this.logger.error(`Failed to get product details: ${error.message}`);
      throw new HttpException(
        'Failed to get product details',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
} 