import { useState } from 'react';
import styles from '../styles/ProductDetails.module.css';

export default function ProductDetails({ product }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const fallbackImage = 'https://via.placeholder.com/800?text=No+Image';

  const handleImageError = (e) => {
    e.target.src = fallbackImage;
  };

  const formatPrice = (price) => {
    if (!price) return 'Price not available';
    if (typeof price === 'number') return `$${price.toFixed(2)}`;
    if (price.startsWith('$')) return price;
    return `$${price}`;
  };

  if (!product) return null;

  return (
    <div className={styles.container}>
      <div className={styles.productLayout}>
        {/* Left side - Image Gallery */}
        <div className={styles.gallery}>
          <div className={styles.mainImage}>
            <img
              src={product.images?.[selectedImage] || fallbackImage}
              alt={product.name}
              onError={handleImageError}
            />
          </div>
          <div className={styles.thumbnails}>
            {product.images?.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${product.name} - View ${index + 1}`}
                className={selectedImage === index ? styles.active : ''}
                onClick={() => setSelectedImage(index)}
                onError={handleImageError}
              />
            ))}
          </div>
        </div>

        {/* Right side - Product Details */}
        <div className={styles.details}>
          <h1 className={styles.title}>{product.name}</h1>
          
          {product.rating && (
            <div className={styles.ratings}>
              <div className={styles.stars}>
                {'★'.repeat(Math.floor(product.rating))}
                {'☆'.repeat(5 - Math.floor(product.rating))}
              </div>
              <span className={styles.reviewCount}>
                {product.reviews} ratings
              </span>
            </div>
          )}

          {product.source && (
            <a href={product.id} className={styles.source} target="_blank" rel="noopener noreferrer">
              Visit on {product.source}
            </a>
          )}

          <div className={styles.pricing}>
            <div className={styles.priceLabel}>Price:</div>
            <div className={styles.currentPrice}>{formatPrice(product.price)}</div>
            {product.originalPrice && (
              <div className={styles.savings}>
                List Price: <span className={styles.strikethrough}>{formatPrice(product.originalPrice)}</span>
                <span className={styles.saveAmount}>
                  You Save: {formatPrice(product.originalPrice - product.price)}
                  ({Math.round((1 - product.price/product.originalPrice) * 100)}%)
                </span>
              </div>
            )}
          </div>

          {/* About this item */}
          <div className={styles.aboutItem}>
            <h2>About this item</h2>
            <ul className={styles.features}>
              {product.features?.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>

          {/* Technical Details */}
          <div className={styles.technicalDetails}>
            <h2>Technical Details</h2>
            <table className={styles.specTable}>
              <tbody>
                {Object.entries(product.specifications || {}).map(([key, value]) => (
                  <tr key={key}>
                    <th className={styles.specLabel}>{key}</th>
                    <td className={styles.specValue}>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Product Description */}
          <div className={styles.description}>
            <h2>Product Description</h2>
            <p>{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
