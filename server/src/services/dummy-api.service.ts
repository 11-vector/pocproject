import { Injectable } from '@nestjs/common';

interface Product {
  id: string;
  name: string;
  thumbnail: string;
  price: string;
  source: string;
  description: string;
  specifications: Record<string, string | string[]>;
  features: string[];
  images: string[];
}

@Injectable()
export class DummyAPIService {
  // Simulate different e-commerce platforms
  private readonly amazonProducts: Product[] = [
    {
      id: 'amz-iphone15',
      name: 'iPhone 15 Pro Max',
      thumbnail: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium?wid=300&hei=300&fmt=jpeg&qlt=95&.v=1692845702708',
      price: '$1,199',
      source: 'Amazon',
      description: 'Latest Apple iPhone with advanced features and A17 Pro chip',
      specifications: {
        'Color': ['Natural Titanium', 'Blue Titanium', 'White Titanium'],
        'Storage': '256GB',
        'Screen': '6.7-inch',
        'Battery': '4422 mAh'
      },
      features: [
        'A17 Pro chip',
        'USB-C Port',
        '48MP Main Camera',
        'Titanium Design'
      ],
      images: Array(8).fill(null).map((_, i) => 
        `https://via.placeholder.com/800?text=Amazon+iPhone+Image+${i + 1}`
      )
    },
    {
      id: 'amz-samsung-s23',
      name: 'Samsung Galaxy S23 Ultra',
      thumbnail: 'https://image-us.samsung.com/us/smartphones/galaxy-s23-ultra/images/gallery/cream/01-DM3-Cream-PDP-1600x1200.jpg',
      price: '$1,299',
      source: 'Amazon',
      description: 'Samsung\'s flagship phone with S Pen and 200MP camera',
      specifications: {
        'Color': ['Phantom Black', 'Cream', 'Green'],
        'Storage': '512GB',
        'Screen': '6.8-inch',
        'Battery': '5000 mAh'
      },
      features: [
        'S Pen included',
        '200MP Camera',
        '100x Space Zoom',
        'Snapdragon 8 Gen 2'
      ],
      images: Array(6).fill(null).map((_, i) => 
        `https://via.placeholder.com/800?text=Amazon+Samsung+Image+${i + 1}`
      )
    }
  ];

  private readonly ebayProducts: Product[] = [
    {
      id: 'ebay-iphone15',
      name: 'iPhone 15 Pro (eBay Listing)',
      thumbnail: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch-bluetitanium?wid=300&hei=300&fmt=jpeg&qlt=95&.v=1692845699311',
      price: '$1,099',
      source: 'eBay',
      description: 'Brand new iPhone 15 Pro with warranty',
      specifications: {
        'Color': ['Black Titanium', 'Natural Titanium'],
        'Storage': ['256GB', '512GB'],
        'Condition': 'New',
        'Warranty': '1 Year'
      },
      features: [
        'Factory Sealed',
        'International Shipping',
        'Buyer Protection',
        'Returns Accepted'
      ],
      images: Array(6).fill(null).map((_, i) => 
        `https://via.placeholder.com/800?text=eBay+iPhone+Image+${i + 1}`
      )
    },
    {
      id: 'ebay-pixel-7',
      name: 'Google Pixel 7 Pro',
      thumbnail: 'https://lh3.googleusercontent.com/9JwR_vZHrwSDLjKE2GHJMtLR-qFvVwkqLXmR9BmxQMvp_mE5mFJeV1q2KEbwDIQJMXY=w300-rw',
      price: '$899',
      source: 'eBay',
      description: 'Google Pixel 7 Pro with advanced AI features',
      specifications: {
        'Color': ['Obsidian', 'Snow', 'Hazel'],
        'Storage': '128GB',
        'Screen': '6.7-inch OLED',
        'Camera': '50MP Main'
      },
      features: [
        'Google Tensor G2',
        'Android 13',
        'Magic Eraser',
        'Face Unlock'
      ],
      images: Array(6).fill(null).map((_, i) => 
        `https://via.placeholder.com/800?text=eBay+Pixel+Image+${i + 1}`
      )
    }
  ];

  private readonly walmartProducts: Product[] = [
    {
      id: 'wm-iphone15',
      name: 'Apple iPhone 15 Pro - Walmart',
      thumbnail: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch-blacktitanium?wid=300&hei=300&fmt=jpeg&qlt=95&.v=1692845694698',
      price: '$999',
      source: 'Walmart',
      description: 'iPhone 15 Pro with Walmart Protection Plan',
      specifications: {
        'Color': ['Natural Titanium', 'Black Titanium'],
        'Storage': '256GB',
        'Model': 'A2849',
        'Carrier': 'Unlocked'
      },
      features: [
        'Walmart Protection Plan',
        'Free 2-day Shipping',
        'Store Pickup Available',
        'Extended Return Window'
      ],
      images: Array(5).fill(null).map((_, i) => 
        `https://via.placeholder.com/800?text=Walmart+iPhone+Image+${i + 1}`
      )
    },
    {
      id: 'wm-oneplus-9',
      name: 'OnePlus 9 Pro',
      thumbnail: 'https://image01.oneplus.net/ebp/202103/12/1-m00-21-d8-rb8bwmbjxoaapgkxaakxktqxpkq772_300_300.png',
      price: '$799',
      source: 'Walmart',
      description: 'OnePlus flagship with Hasselblad cameras',
      specifications: {
        'Color': ['Morning Mist', 'Pine Green'],
        'Storage': '256GB',
        'Screen': '6.7-inch Fluid AMOLED',
        'Charging': '65W Warp Charge'
      },
      features: [
        'Snapdragon 888',
        'Hasselblad Camera',
        '120Hz Display',
        'OxygenOS'
      ],
      images: Array(6).fill(null).map((_, i) => 
        `https://via.placeholder.com/800?text=Walmart+OnePlus+Image+${i + 1}`
      )
    }
  ];

  async searchAmazon(query: string): Promise<Product[]> {
    await this.simulateNetworkDelay();
    return this.amazonProducts.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  async searchEbay(query: string): Promise<Product[]> {
    await this.simulateNetworkDelay();
    return this.ebayProducts.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  async searchWalmart(query: string): Promise<Product[]> {
    await this.simulateNetworkDelay();
    return this.walmartProducts.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  async getProductDetails(id: string): Promise<Product | null> {
    await this.simulateNetworkDelay();
    const allProducts = [
      ...this.amazonProducts,
      ...this.ebayProducts,
      ...this.walmartProducts
    ];
    return allProducts.find(p => p.id === id) || null;
  }

  private async simulateNetworkDelay(): Promise<void> {
    const delay = Math.random() * 300; // Reduced from 1000ms to 300ms
    await new Promise(resolve => setTimeout(resolve, delay));
  }
} 