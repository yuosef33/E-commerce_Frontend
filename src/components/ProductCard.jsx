import { Link } from 'react-router-dom';
import { FiShoppingCart } from 'react-icons/fi';

export default function ProductCard({ product, onAddToCart }) {
  const imageUrl = '/photo1.png';

  return (
    <div className="product-card" id={`product-card-${product.id}`}>
      <Link to={`/products/${product.id}`} className="product-card-image-link">
        <div className="product-card-image">
          <img src={imageUrl} alt={product.name} loading="lazy" />
          <div className="product-card-overlay">
            <span>View Details</span>
          </div>
        </div>
      </Link>
      <div className="product-card-body">
        <span className="product-card-category">{product.categoryName || 'General'}</span>
        <Link to={`/products/${product.id}`}>
          <h3 className="product-card-title">{product.name}</h3>
        </Link>
        <p className="product-card-desc">{product.description?.substring(0, 60)}{product.description?.length > 60 ? '...' : ''}</p>
        <div className="product-card-footer">
          <span className="product-card-price">${Number(product.price).toFixed(2)}</span>
          {onAddToCart && (
            <button
              className="btn-add-cart"
              onClick={() => onAddToCart(product.id)}
              id={`add-cart-${product.id}`}
            >
              <FiShoppingCart size={16} /> Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
