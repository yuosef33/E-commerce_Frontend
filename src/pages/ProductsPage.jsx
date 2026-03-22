import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../api/productApi';
import { getCategories } from '../api/categoryApi';
import { addItemToCart } from '../api/cartApi';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';
import { FiSearch } from 'react-icons/fi';
import { sanitizeSearchParam } from '../utils/security';

export default function ProductsPage({ refreshCart }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(sanitizeSearchParam(searchParams.get('search') || ''));
  const [selectedCategory, setSelectedCategory] = useState(sanitizeSearchParam(searchParams.get('category') || ''));
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { page, size: 12 };
    if (selectedCategory) params.categoryId = selectedCategory;
    if (search) params.search = search;

    getProducts(params)
      .then((res) => {
        setProducts(res.data.data?.content || []);
        setTotalPages(res.data.data?.totalPages || 0);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [page, selectedCategory, search]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    const val = sanitizeSearchParam(e.target.elements.search.value);
    setSearch(val);
    const sp = new URLSearchParams(searchParams);
    if (val) sp.set('search', val); else sp.delete('search');
    setSearchParams(sp);
  };

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    setPage(0);
    const sp = new URLSearchParams(searchParams);
    if (catId) sp.set('category', catId); else sp.delete('category');
    setSearchParams(sp);
  };

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
    <div className="products-page">
      <div className="page-header">
        <h1>Our <span className="gradient-text">Products</span></h1>
        <p>Discover our complete collection</p>
      </div>

      <div className="products-layout">
        {/* Sidebar */}
        <aside className="products-sidebar">
          <form onSubmit={handleSearch} className="search-box" id="search-form">
            <FiSearch size={18} className="input-icon" />
            <input type="text" name="search" placeholder="Search products..." defaultValue={search} id="search-input" />
            <button type="submit" className="btn-primary btn-sm" id="search-submit">Search</button>
          </form>

          <div className="filter-section">
            <h3>Categories</h3>
            <button
              className={`filter-btn ${!selectedCategory ? 'active' : ''}`}
              onClick={() => handleCategoryChange('')}
              id="filter-all"
            >
              All Products
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`filter-btn ${selectedCategory == cat.id ? 'active' : ''}`}
                onClick={() => handleCategoryChange(cat.id)}
                id={`filter-cat-${cat.id}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </aside>

        {/* Grid */}
        <main className="products-main">
          {loading ? (
            <div className="spinner-container"><div className="spinner"></div></div>
          ) : products.length > 0 ? (
            <>
              <div className="products-grid">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="pagination">
                  <button disabled={page === 0} onClick={() => setPage(page - 1)} className="btn-outline btn-sm" id="prev-page">Previous</button>
                  <span className="page-info">Page {page + 1} of {totalPages}</span>
                  <button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)} className="btn-outline btn-sm" id="next-page">Next</button>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <h3>No products found</h3>
              <p>Try adjusting your search or filters.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
