import { useEffect, useState } from 'react';
import { getCategories } from '../api/categoryApi';
import { createProduct } from '../api/productApi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiPackage, FiDollarSign, FiBox, FiImage, FiFileText, FiLayers } from 'react-icons/fi';
import { stripHtml } from '../utils/security';

export default function CreateProductPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data.data || []))
      .catch(() => toast.error('Failed to load categories'));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanName = stripHtml(name);
    const cleanDesc = stripHtml(description);
    const cleanImage = stripHtml(imageUrl);

    if (!cleanName || !price || !stock || !categoryId) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (Number(price) <= 0) {
      toast.error('Price must be greater than 0');
      return;
    }
    if (Number(stock) < 0) {
      toast.error('Stock cannot be negative');
      return;
    }

    setLoading(true);
    try {
      await createProduct({
        name: cleanName,
        description: cleanDesc || null,
        price: Number(price),
        stock: Number(stock),
        imageUrl: cleanImage || 'photo1',
        categoryId: Number(categoryId),
      });
      toast.success('Product created successfully!');
      navigate('/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: '520px' }}>
        <div className="auth-header">
          <div className="auth-icon"><FiPackage size={28} /></div>
          <h1>Sell a Product</h1>
          <p>Add a new product to the marketplace</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form" id="create-product-form">
          <div className="input-group">
            <FiPackage size={18} className="input-icon" />
            <input
              type="text"
              placeholder="Product name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={100}
              id="product-name"
            />
          </div>
          <div className="input-group">
            <FiFileText size={18} className="input-icon" />
            <textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              maxLength={500}
              id="product-description"
            />
          </div>
          <div className="form-row">
            <div className="input-group">
              <FiDollarSign size={18} className="input-icon" />
              <input
                type="number"
                placeholder="Price *"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                min="0.01"
                step="0.01"
                id="product-price"
              />
            </div>
            <div className="input-group">
              <FiBox size={18} className="input-icon" />
              <input
                type="number"
                placeholder="Stock *"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
                min="0"
                id="product-stock"
              />
            </div>
          </div>
          <div className="input-group">
            <FiImage size={18} className="input-icon" />
            <input
              type="text"
              placeholder="Image URL (optional)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              maxLength={500}
              id="product-image"
            />
          </div>
          <div className="input-group">
            <FiLayers size={18} className="input-icon" />
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              id="product-category"
            >
              <option value="">Select category *</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn-primary btn-full" disabled={loading} id="create-product-submit">
            {loading ? 'Creating...' : 'Create Product'}
          </button>
        </form>
      </div>
    </div>
  );
}
