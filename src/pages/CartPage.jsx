import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCart, updateCartItem, removeCartItem, clearCart } from '../api/cartApi';
import toast from 'react-hot-toast';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiX } from 'react-icons/fi';

export default function CartPage({ refreshCart }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadCart = async () => {
    try {
      const res = await getCart();
      setCart(res.data.data);
    } catch {
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCart(); }, []);

  const handleUpdate = async (productId, quantity) => {
    try {
      const res = await updateCartItem(productId, quantity);
      setCart(res.data.data);
      if (refreshCart) refreshCart();
    } catch {
      toast.error('Failed to update');
    }
  };

  const handleRemove = async (productId) => {
    try {
      const res = await removeCartItem(productId);
      setCart(res.data.data);
      toast.success('Item removed');
      if (refreshCart) refreshCart();
    } catch {
      toast.error('Failed to remove');
    }
  };

  const handleClear = async () => {
    try {
      await clearCart();
      setCart(null);
      toast.success('Cart cleared');
      if (refreshCart) refreshCart();
    } catch {
      toast.error('Failed to clear cart');
    }
  };

  if (loading) return <div className="spinner-container"><div className="spinner"></div></div>;

  const items = cart?.items || [];

  return (
    <div className="cart-page">
      <div className="page-header">
        <h1>Shopping <span className="gradient-text">Cart</span></h1>
        <p>{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <FiShoppingBag size={64} />
          <h3>Your cart is empty</h3>
          <p>Start adding some amazing products!</p>
          <Link to="/products" className="btn-primary btn-lg">Browse Products</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {items.map((item) => (
              <div key={item.productId} className="cart-item" id={`cart-item-${item.productId}`}>
                <div className="cart-item-image">
                  <img src="/photo1.png" alt={item.productName} />
                </div>
                <div className="cart-item-info">
                  <Link to={`/products/${item.productId}`}>
                    <h3>{item.productName}</h3>
                  </Link>
                  <p className="cart-item-price">${Number(item.price).toFixed(2)}</p>
                </div>
                <div className="cart-item-actions">
                  <div className="quantity-selector">
                    <button className="qty-btn" onClick={() => handleUpdate(item.productId, item.quantity - 1)} disabled={item.quantity <= 1}>
                      <FiMinus size={14} />
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => handleUpdate(item.productId, item.quantity + 1)}>
                      <FiPlus size={14} />
                    </button>
                  </div>
                  <span className="cart-item-subtotal">${Number(item.subtotal).toFixed(2)}</span>
                  <button className="btn-icon-danger" onClick={() => handleRemove(item.productId)}>
                    <FiX size={18} />
                  </button>
                </div>
              </div>
            ))}
            <button className="btn-outline btn-sm clear-cart-btn" onClick={handleClear} id="clear-cart">
              <FiTrash2 size={14} /> Clear Cart
            </button>
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Items ({cart.itemCount})</span>
              <span>${Number(cart.total).toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span className="free-shipping">Free</span>
            </div>
            <hr />
            <div className="summary-row total">
              <span>Total</span>
              <span>${Number(cart.total).toFixed(2)}</span>
            </div>
            <button className="btn-primary btn-full btn-lg" onClick={() => navigate('/checkout')} id="checkout-btn">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
