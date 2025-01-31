import { useState } from 'react';
import SearchBar from '../components/SearchBar';
import ProductList from '../components/ProductList';
import ProductDetails from '../components/ProductDetails';
import styles from '../styles/Home.module.css';
import { API_URL } from '../config';

export default function Home() {
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (query) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Sending search request for:', query);
      
      const response = await fetch(`${API_URL}/api/search?q=${encodeURIComponent(query)}`);
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log('Error data:', errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Received data:', data);
      
      if (!Array.isArray(data)) {
        throw new Error('Invalid response format');
      }
      
      setSearchResults(data);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Search error:', error);
      setError('Failed to search products. Please try again.');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductSelect = async (product) => {
    try {
      setError(null);
      const response = await fetch(`/api/products/${encodeURIComponent(product.id)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const detailedProduct = await response.json();
      setSelectedProduct(detailedProduct);
    } catch (error) {
      console.error('Product fetch error:', error);
      setError('Failed to load product details. Please try again.');
      setSelectedProduct(null);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Product Search</h1>
      <SearchBar onSearch={handleSearch} />
      
      {isLoading && (
        <div className={styles.loading}>
          Searching products...
        </div>
      )}
      
      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      {!isLoading && searchResults.length > 0 && !selectedProduct && (
        <ProductList products={searchResults} onProductSelect={handleProductSelect} />
      )}
      
      {selectedProduct && (
        <ProductDetails product={selectedProduct} />
      )}
    </div>
  );
}
