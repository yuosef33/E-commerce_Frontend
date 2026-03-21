import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-logo">
            <span className="logo-icon">◆</span> LUXE
          </h3>
          <p>Premium shopping experience with curated products for the modern lifestyle.</p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="footer-section">
          <h4>Customer Service</h4>
          <Link to="/orders">My Orders</Link>
          <Link to="/cart">Shopping Cart</Link>
          <a href="#">Shipping Policy</a>
          <a href="#">Returns & Refunds</a>
        </div>

        <div className="footer-section">
          <h4>Contact Info</h4>
          <p><FiMapPin size={14} /> 123 Luxe Street, Fashion City</p>
          <p><FiPhone size={14} /> +1 (555) 123-4567</p>
          <p><FiMail size={14} /> support@luxe.com</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} LUXE. All rights reserved.</p>
      </div>
    </footer>
  );
}
