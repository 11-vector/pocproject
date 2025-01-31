import styles from '../styles/ProductList.module.css';

export default function ProductList({ products, onProductSelect }) {
  // Mock data for testing
  const mockProducts = [
    {
      id: '1',
      name: 'Sample Product 1',
      thumbnail: 'https://via.placeholder.com/150',
      price: '$99.99',
      source: 'Mock Source'
    },
    {
      id: '2',
      name: 'Sample Product 2',
      thumbnail: 'https://via.placeholder.com/150',
      price: '$49.99',
      source: 'Mock Source'
    }
  ];

  const displayedProducts = products.length > 0 ? products : mockProducts;

  return (
    <div className={styles.productList}>
      {displayedProducts.map((product) => (
        <div 
          key={product.id} 
          className={styles.productCard}
          onClick={() => onProductSelect(product)}
        >
          <div className={styles.imageContainer}>
            <img 
              src={product.thumbnail} 
              alt={product.name}
              className={styles.productImage}
            />
            <span className={styles.source}>{product.source}</span>
          </div>
          <h3 className={styles.productName}>{product.name}</h3>
          <p className={styles.productPrice}>{product.price}</p>
        </div>
      ))}
    </div>
  );
}
