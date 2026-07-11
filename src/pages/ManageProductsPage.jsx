import { useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { formatINR } from '../utils/currency';

export default function ManageProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const data = await authAPI.getProducts();
      setProducts(data.data || []);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) =>
    `${p.name} ${p.pantone}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockBadge = (stock) => {
    if (stock > 100) return { cls: 'badge-success', text: 'In Stock' };
    if (stock > 20) return { cls: 'badge-warning', text: 'Low Stock' };
    return { cls: 'badge-error', text: 'Critical' };
  };

  return (
    <div id="manage-products-page">
      <header className="page-header">
        <p className="page-greeting">Administration</p>
        <h1 className="page-title">
          Manage <span>Products</span> 📦
        </h1>
      </header>

      {/* Toolbar */}
      <div className="table-toolbar">
        <div className="search-wrapper">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="search-icon">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            id="search-products"
          />
        </div>
        <div className="table-toolbar-info">
          <span className="badge badge-primary">{filteredProducts.length} products</span>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="table-loading">
          <div className="loading-spinner" style={{ width: '24px', height: '24px' }} />
          <span>Loading products...</span>
        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => {
            const stockBadge = getStockBadge(product.stock);
            return (
              <article className="product-card" key={product.id}>
                <div
                  className="product-color-strip"
                  style={{ background: product.color }}
                  aria-hidden="true"
                />
                <div className="product-card-body">
                  <div className="product-card-header">
                    <div
                      className="product-color-swatch"
                      style={{ background: product.color }}
                      title={product.color}
                    />
                    <span className={`badge ${stockBadge.cls}`}>{stockBadge.text}</span>
                  </div>
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-meta">
                    <span className="product-pantone">Pantone {product.pantone}</span>
                    <span className="product-year">Since {product.year}</span>
                  </div>
                  <div className="product-footer">
                    <div className="product-price">{formatINR(product.price)}</div>
                    <div className="product-stock">{product.stock} units</div>
                  </div>
                </div>
              </article>
            );
          })}
          {filteredProducts.length === 0 && (
            <div className="product-empty">
              No products found matching "{searchTerm}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
