import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../api/orderApi';
import toast from 'react-hot-toast';
import { FiPackage, FiCalendar, FiMapPin } from 'react-icons/fi';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders()
      .then((res) => setOrders(res.data.data || []))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner-container"><div className="spinner"></div></div>;

  return (
    <div className="orders-page">
      <div className="page-header">
        <h1>My <span className="gradient-text">Orders</span></h1>
        <p>{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <FiPackage size={64} />
          <h3>No orders yet</h3>
          <p>Start shopping and your orders will appear here.</p>
          <Link to="/products" className="btn-primary btn-lg">Browse Products</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card" id={`order-${order.id}`}>
              <div className="order-card-header">
                <div>
                  <h3>Order #{order.id}</h3>
                  <span className={`order-status status-${order.status?.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>
                <div className="order-meta">
                  <span><FiCalendar size={14} /> {new Date(order.createdAt).toLocaleDateString()}</span>
                  <span><FiMapPin size={14} /> {order.city}, {order.country}</span>
                </div>
              </div>
              <div className="order-items">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="order-item-row">
                    <img src="/photo1.png" alt={item.productName} className="order-item-img" />
                    <div className="order-item-info">
                      <span className="order-item-name">{item.productName}</span>
                      <span className="order-item-detail">Qty: {item.quantity} × ${Number(item.priceAtPurchase).toFixed(2)}</span>
                    </div>
                    <span className="order-item-subtotal">${Number(item.subtotal).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="order-card-footer">
                <span className="order-address"><FiMapPin size={14} /> {order.shippingAddress}</span>
                <span className="order-total">Total: ${Number(order.totalAmount).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
