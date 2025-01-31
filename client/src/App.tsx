import React, { useState, useEffect } from 'react';
import { ProductCard } from './components/ProductCard';
import './App.css';

interface Product {
  id: string;
  name: string;
  thumbnail: string;
  price: string;
  description: string;
  rating?: number;
  reviews?: number;
}

function App() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchProducts = async () => {
    if (!query) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3002/api/products/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to search products. Please try again.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Add keyboard support
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchProducts();
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Product Search</h1>
        <div className="search-container">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search for products..."
            className="search-input"
          />
          <button onClick={searchProducts} className="search-button">
            Search
          </button>
        </div>
      </header>
      {error && (
        <div className="error-message">{error}</div>
      )}
      <main className="products-grid">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : products.length > 0 ? (
          products.map(product => (
            <ProductCard
              key={product.id}
              {...product}
            />
          ))
        ) : (
          <div className="no-results">No products found</div>
        )}
      </main>
    </div>
  );
}

export default App; 