import { Injectable } from '@nestjs/common';

@Injectable()
export class MockProductService {
  private readonly mockProducts = {
    phones: [
      {
        id: 'iphone-15-pro',
        name: 'iPhone 15 Pro',
        thumbnail: 'https://via.placeholder.com/150',
        price: '$999',
        source: 'Apple Store',
        description: 'The latest iPhone with advanced features...',
        specifications: {
          'Color': ['Space Black', 'Natural Titanium', 'White Titanium'],
          'Storage': ['256GB', '512GB', '1TB'],
          'Display': '6.1-inch Super Retina XDR',
          'Chip': 'A17 Pro chip'
        }
      },
      {
        id: 'samsung-s23',
        name: 'Samsung Galaxy S23 Ultra',
        thumbnail: 'https://via.placeholder.com/150',
        price: '$1199',
        source: 'Samsung',
        description: 'Premium Android smartphone with S Pen...',
        specifications: {
          'Color': ['Phantom Black', 'Cream', 'Green', 'Lavender'],
          'Storage': ['256GB', '512GB'],
          'Display': '6.8-inch Dynamic AMOLED 2X',
          'Chip': 'Snapdragon 8 Gen 2'
        }
      }
    ],
    laptops: [
      {
        id: 'macbook-pro-16',
        name: 'MacBook Pro 16"',
        thumbnail: 'https://via.placeholder.com/150',
        price: '$2499',
        source: 'Apple Store',
        description: 'Powerful laptop for professionals...',
        specifications: {
          'Color': ['Space Gray', 'Silver'],
          'Storage': ['512GB', '1TB', '2TB'],
          'Display': '16-inch Liquid Retina XDR',
          'Chip': 'M2 Pro/Max'
        }
      }
    ]
  };

  async searchProducts(query: string) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Search across all categories
    const allProducts = Object.values(this.mockProducts).flat();
    
    // Simple search implementation
    return allProducts.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  async getProductDetails(id: string) {
    await new Promise(resolve => setTimeout(resolve, 300));

    // Search for product across all categories
    const allProducts = Object.values(this.mockProducts).flat();
    const product = allProducts.find(p => p.id === id);

    if (!product) {
      throw new Error('Product not found');
    }

    // Add mock high-res images
    return {
      ...product,
      images: Array(6).fill(null).map((_, i) => 
        `https://via.placeholder.com/800?text=Product+Image+${i + 1}`
      ),
      features: [
        'Premium build quality',
        'Latest technology',
        'High performance',
        'Energy efficient',
        'One year warranty'
      ]
    };
  }
} 