import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../api/productApi';
import { addItemToCart } from '../api/cartApi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiShoppingCart, FiArrowLeft, FiMinus, FiPlus } from 'react-icons/fi';

export default function ProductDetailPage({ refreshCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    getProductById(id)
      .then((res) => setProduct(res.data.data))
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    setAdding(true);
    try {
      await addItemToCart(product.id, quantity);
      toast.success(`Added ${quantity} item(s) to cart!`);
      if (refreshCart) refreshCart();
    } catch {
      toast.error('Failed to add item');
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <div className="spinner-container"><div className="spinner"></div></div>;
  if (!product) return <div className="empty-state"><h3>Product not found</h3></div>;

  const imageUrl = '/photo1.png';

  return (
    <div className="product-detail-page">
      <button className="back-btn" onClick={() => navigate(-1)} id="back-btn">
        <FiArrowLeft size={18} /> Back
      </button>
      <div className="product-detail-content">
        <div className="product-detail-image">
          <img src={imageUrl} alt={product.name} />
        </div>
        <div className="product-detail-info">
          <span className="product-card-category">{product.categoryName || 'General'}</span>
          <h1>{product.name}</h1>
          <p className="product-detail-price">${Number(product.price).toFixed(2)}</p>
          <p className="product-detail-desc">{product.description || 'No description available.'}</p>

          <div className="product-detail-meta">
            <div className="meta-item">
              <span className="meta-label">Availability</span>
              <span className={`meta-value ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
              </span>
            </div>
          </div>

          <div className="quantity-selector">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="qty-btn" id="qty-minus">
              <FiMinus size={16} />
            </button>
            <span className="qty-value">{quantity}</span>
            <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="qty-btn" id="qty-plus">
              <FiPlus size={16} />
            </button>
          </div>

          <button
            className="btn-primary btn-lg btn-full"
            onClick={handleAddToCart}
            disabled={adding || product.stock === 0}
            id="detail-add-cart"
          >
            <FiShoppingCart size={18} />
            {adding ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
