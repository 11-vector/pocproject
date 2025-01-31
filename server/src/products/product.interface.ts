export interface Product {
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