import Image from 'next/image';
import styles from '../styles/ProductCard.module.css';

export default function ProductCard({ product, onClick }) {
  const fallbackImage = 'https://via.placeholder.com/300?text=No+Image';

  const handleImageError = (e) => {
    e.target.src = fallbackImage;
  };

  const formatPrice = (price) => {
    if (!price) return 'Contact for price';
    if (typeof price === 'number') return `$${price.toFixed(2)}`;
    if (price.startsWith('$')) return price;
    return `$${price}`;
  };

  return (
    <div className={styles.card} onClick={() => onClick(product)}>
      <div className={styles.imageContainer}>
        <img
          src={product.thumbnail || fallbackImage}
          alt={product.name}
          className={styles.image}
          onError={handleImageError}
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{product.name}</h3>
        <p className={styles.price}>{formatPrice(product.price)}</p>
        {product.source && (
          <p className={styles.source}>From: {product.source}</p>
        )}
        {product.rating && (
          <div className={styles.rating}>
            {'★'.repeat(Math.floor(product.rating))}
            {'☆'.repeat(5 - Math.floor(product.rating))}
            {product.reviews && ` (${product.reviews})`}
          </div>
        )}
        <p className={styles.description}>
          {product.description?.slice(0, 100)}
          {product.description?.length > 100 ? '...' : ''}
        </p>
      </div>
    </div>
  );
} 