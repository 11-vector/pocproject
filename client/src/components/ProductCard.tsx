import React from 'react';
import './ProductCard.css';

interface ProductCardProps {
  name: string;
  price: string;
  thumbnail: string;
  description: string;
  rating?: number;
  reviews?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  name,
  price,
  thumbnail,
  description,
  rating,
  reviews
}) => {
  return (
    <div className="product-card">
      <img src={thumbnail} alt={name} className="product-image" />
      <div className="product-info">
        <h3 className="product-name">{name}</h3>
        <p className="product-price">{price}</p>
        <p className="product-description">{description}</p>
        {rating && (
          <div className="product-rating">
            <span>★ {rating}</span>
            {reviews && <span>({reviews} reviews)</span>}
          </div>
        )}
      </div>
    </div>
  );
}; 