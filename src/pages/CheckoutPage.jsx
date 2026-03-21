import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkout } from '../api/orderApi';
import toast from 'react-hot-toast';
import { FiMapPin, FiHome, FiGlobe, FiCheck } from 'react-icons/fi';

export default function CheckoutPage({ refreshCart }) {
  const [shippingAddress, setShippingAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!shippingAddress || !city || !country) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await checkout(shippingAddress, city, country);
      toast.success('Order placed successfully!');
      if (refreshCart) refreshCart();
      navigate('/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card checkout-card">
        <div className="auth-header">
          <div className="auth-icon"><FiCheck size={28} /></div>
          <h1>Checkout</h1>
          <p>Enter your shipping details</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form" id="checkout-form">
          <div className="input-group">
            <FiHome size={18} className="input-icon" />
            <input
              type="text"
              placeholder="Shipping address"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              required
              id="checkout-address"
            />
          </div>
          <div className="input-group">
            <FiMapPin size={18} className="input-icon" />
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              id="checkout-city"
            />
          </div>
          <div className="input-group">
            <FiGlobe size={18} className="input-icon" />
            <input
              type="text"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
              id="checkout-country"
            />
          </div>
          <button type="submit" className="btn-primary btn-full" disabled={loading} id="checkout-submit">
            {loading ? 'Placing order...' : 'Place Order'}
          </button>
        </form>
      </div>
    </div>
  );
}
