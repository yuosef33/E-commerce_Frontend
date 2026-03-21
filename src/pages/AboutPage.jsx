import { Link } from 'react-router-dom';
import { FiTarget, FiHeart, FiAward, FiUsers } from 'react-icons/fi';

export default function AboutPage() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <h1>About <span className="gradient-text">LUXE</span></h1>
        <p>We believe everyone deserves access to premium products. Since our founding, we've been committed to curating the finest selection of products with exceptional quality and unbeatable prices.</p>
      </section>

      <section className="about-values">
        <div className="value-card">
          <div className="value-icon"><FiTarget size={32} /></div>
          <h3>Our Mission</h3>
          <p>To deliver premium products worldwide with exceptional customer service and fast, reliable shipping.</p>
        </div>
        <div className="value-card">
          <div className="value-icon"><FiHeart size={32} /></div>
          <h3>Our Passion</h3>
          <p>We're passionate about quality. Every product is carefully selected and vetted to meet our high standards.</p>
        </div>
        <div className="value-card">
          <div className="value-icon"><FiAward size={32} /></div>
          <h3>Quality First</h3>
          <p>We partner only with trusted manufacturers and brands to ensure every purchase exceeds expectations.</p>
        </div>
        <div className="value-card">
          <div className="value-icon"><FiUsers size={32} /></div>
          <h3>Community</h3>
          <p>Over 50,000 happy customers trust us for their shopping needs. Join our growing community today.</p>
        </div>
      </section>

      <section className="about-stats">
        <div className="stat">
          <span className="stat-number">50K+</span>
          <span className="stat-label">Happy Customers</span>
        </div>
        <div className="stat">
          <span className="stat-number">1000+</span>
          <span className="stat-label">Products</span>
        </div>
        <div className="stat">
          <span className="stat-number">99%</span>
          <span className="stat-label">Satisfaction Rate</span>
        </div>
        <div className="stat">
          <span className="stat-number">24/7</span>
          <span className="stat-label">Support</span>
        </div>
      </section>

      <section className="about-cta">
        <h2>Ready to <span className="gradient-text">Start Shopping</span>?</h2>
        <p>Explore our curated collection and find something you love.</p>
        <Link to="/products" className="btn-primary btn-lg">View Products</Link>
      </section>
    </div>
  );
}
