import { Injectable } from '@nestjs/common';

@Injectable()
export class MockDataService {
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
          'Chip': 'A17 Pro chip',
        },
        images: Array(5).fill('https://via.placeholder.com/800'),
        features: [
          'Advanced camera system',
          'All-day battery life',
          'Face ID'
        ]
      },
      {
        id: 'samsung-s23',
        name: 'Samsung Galaxy S23',
        thumbnail: 'https://via.placeholder.com/150',
        price: '$899',
        source: 'Samsung Store',
        description: 'Samsung\'s flagship phone with exceptional camera...',
        specifications: {
          'Color': ['Phantom Black', 'Cream', 'Green', 'Lavender'],
          'Storage': ['256GB', '512GB'],
          'Display': '6.1-inch Dynamic AMOLED 2X',
          'Chip': 'Snapdragon 8 Gen 2',
        },
        images: Array(5).fill('https://via.placeholder.com/800'),
        features: [
          'Pro-grade camera',
          '5G capability',
          'Wireless PowerShare'
        ]
      }
    ],
    laptops: [
      {
        id: 'macbook-pro-16',
        name: 'MacBook Pro 16"',
        thumbnail: 'https://via.placeholder.com/150',
        price: '$2499',
        source: 'Apple Store',
        description: 'Supercharged for pros...',
        specifications: {
          'Color': ['Space Gray', 'Silver'],
          'Storage': ['512GB', '1TB', '2TB'],
          'Memory': ['16GB', '32GB', '64GB'],
          'Chip': 'M2 Pro or M2 Max',
        },
        images: Array(5).fill('https://via.placeholder.com/800'),
        features: [
          'Up to 22 hours battery life',
          'Liquid Retina XDR display',
          'Advanced thermal systems'
        ]
      }
    ]
  };

  searchProducts(query: string) {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const results = [];
        Object.values(this.mockProducts).forEach(category => {
          category.forEach(product => {
            if (product.name.toLowerCase().includes(query.toLowerCase())) {
              results.push(product);
            }
          });
        });
        resolve(results);
      }, 500); // 500ms delay to simulate network request
    });
  }

  getProductDetails(id: string) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let product = null;
        Object.values(this.mockProducts).forEach(category => {
          const found = category.find(p => p.id === id);
          if (found) product = found;
        });
        resolve(product);
      }, 300);
    });
  }
} 