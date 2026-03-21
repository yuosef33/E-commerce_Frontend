import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { FiShoppingCart, FiMenu, FiX, FiUser, FiLogOut, FiPackage } from 'react-icons/fi';

export default function Navbar({ cartCount = 0 }) {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setProfileOpen(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">◆</span>
          <span className="logo-text">LUXE</span>
        </Link>

        <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/products" onClick={() => setMenuOpen(false)}>Products</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
        </div>

        <div className="navbar-actions">
          {isAuthenticated && (
            <Link to="/cart" className="cart-btn" id="cart-button">
              <FiShoppingCart size={20} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
          )}

          {isAuthenticated ? (
            <div className="profile-dropdown">
              <button className="profile-btn" onClick={() => setProfileOpen(!profileOpen)} id="profile-button">
                <FiUser size={18} />
                <span>{user?.name || 'User'}</span>
              </button>
              {profileOpen && (
                <div className="dropdown-menu">
                  <Link to="/orders" onClick={() => setProfileOpen(false)} id="orders-link">
                    <FiPackage size={16} /> My Orders
                  </Link>
                  <button onClick={handleLogout} id="logout-button">
                    <FiLogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-btns">
              <Link to="/login" className="btn-outline" id="login-nav-btn">Login</Link>
              <Link to="/register" className="btn-primary" id="register-nav-btn">Sign Up</Link>
            </div>
          )}

          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} id="menu-toggle">
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
