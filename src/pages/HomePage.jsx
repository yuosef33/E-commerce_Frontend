import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../api/productApi';
import { getCategories } from '../api/categoryApi';
import ProductCard from '../components/ProductCard';
import { addItemToCart } from '../api/cartApi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiTruck, FiShield, FiRefreshCw, FiHeadphones } from 'react-icons/fi';

export default function HomePage({ refreshCart }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const load = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          getProducts({ page: 0, size: 8 }),
          getCategories()
        ]);
        setProducts(prodRes.data.data?.content || []);
        setCategories(catRes.data.data || []);
      } catch {
        // Silently handle — page still renders
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleAddToCart = async (productId) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    try {
      await addItemToCart(productId, 1);
      toast.success('Added to cart!');
      if (refreshCart) refreshCart();
    } catch {
      toast.error('Failed to add item');
    }
  };

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">New Collection 2026</span>
          <h1>Discover <span className="gradient-text">Premium</span> Products</h1>
          <p>Curated selection of the finest products. Experience luxury shopping with fast delivery and exceptional quality.</p>
          <div className="hero-btns">
            <Link to="/products" className="btn-primary btn-lg" id="hero-shop-btn">Shop Now</Link>
            <Link to="/about" className="btn-outline btn-lg">Learn More</Link>
          </div>
        </div>
        <div className="hero-image">
          <img src="/photo1.png" alt="Premium Product" />
          <div className="hero-glow"></div>
        </div>
      </section>

      {/* Features */}
      <section className="features-strip">
        <div className="feature-item">
          <FiTruck size={28} />
          <div>
            <strong>Free Shipping</strong>
            <span>On orders over $50</span>
          </div>
        </div>
        <div className="feature-item">
          <FiShield size={28} />
          <div>
            <strong>Secure Payment</strong>
            <span>100% protected</span>
          </div>
        </div>
        <div className="feature-item">
          <FiRefreshCw size={28} />
          <div>
            <strong>Easy Returns</strong>
            <span>30-day policy</span>
          </div>
        </div>
        <div className="feature-item">
          <FiHeadphones size={28} />
          <div>
            <strong>24/7 Support</strong>
            <span>Dedicated help</span>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="section">
          <div className="section-header">
            <h2>Shop by <span className="gradient-text">Category</span></h2>
            <p>Browse our curated collections</p>
          </div>
          <div className="categories-grid">
            {categories.map((cat) => (
              <Link to={`/products?category=${cat.id}`} key={cat.id} className="category-card" id={`category-${cat.id}`}>
                <div className="category-icon">◆</div>
                <h3>{cat.name}</h3>
                <p>{cat.description || 'Explore collection'}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="section">
        <div className="section-header">
          <h2>Featured <span className="gradient-text">Products</span></h2>
          <p>Handpicked just for you</p>
        </div>
        {loading ? (
          <div className="spinner-container"><div className="spinner"></div></div>
        ) : products.length > 0 ? (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
            ))}
          </div>
        ) : (
          <p className="empty-text">No products available yet.</p>
        )}
        <div className="section-cta">
          <Link to="/products" className="btn-primary btn-lg">View All Products</Link>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to <span className="gradient-text">Elevate</span> Your Style?</h2>
          <p>Join thousands of satisfied customers and discover our premium collection.</p>
          {!isAuthenticated && (
            <Link to="/register" className="btn-primary btn-lg" id="cta-signup">Create Account</Link>
          )}
        </div>
      </section>
    </div>
  );
}
