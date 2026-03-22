import { useEffect, useState } from 'react';
import { getCategories } from '../api/categoryApi';
import api from '../api/api';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiGrid, FiEdit2, FiX } from 'react-icons/fi';
import { stripHtml } from '../utils/security';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const loadCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data.data || []);
    } catch {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCategories(); }, []);

  const resetForm = () => {
    setShowForm(false);
    setEditId(null);
    setName('');
    setDescription('');
  };

  const handleEdit = (cat) => {
    setEditId(cat.id);
    setName(cat.name);
    setDescription(cat.description || '');
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanName = stripHtml(name);
    const cleanDesc = stripHtml(description);
    if (!cleanName) {
      toast.error('Category name is required');
      return;
    }
    setSaving(true);
    try {
      if (editId) {
        await api.put(`/categories/${editId}`, { name: cleanName, description: cleanDesc || null });
        toast.success('Category updated!');
      } else {
        await api.post('/categories', { name: cleanName, description: cleanDesc || null });
        toast.success('Category created!');
      }
      resetForm();
      await loadCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, catName) => {
    if (!window.confirm(`Delete category "${catName}"? This may affect associated products.`)) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success('Category deleted');
      await loadCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete category');
    }
  };

  if (loading) return <div className="spinner-container"><div className="spinner"></div></div>;

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Manage <span className="gradient-text">Categories</span></h1>
        <p>Add, edit, or remove product categories</p>
      </div>

      <div className="admin-content">
        {/* Add / Edit Form */}
        {showForm ? (
          <div className="admin-form-card">
            <div className="admin-form-header">
              <h3>{editId ? 'Edit Category' : 'New Category'}</h3>
              <button className="btn-icon-danger" onClick={resetForm}><FiX size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="auth-form" id="category-form">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Category name *"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  maxLength={50}
                  autoFocus
                  id="category-name"
                  style={{ paddingLeft: '14px' }}
                />
              </div>
              <div className="input-group">
                <textarea
                  placeholder="Description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="2"
                  maxLength={200}
                  id="category-description"
                />
              </div>
              <div className="form-row">
                <button type="submit" className="btn-primary" disabled={saving} id="category-submit">
                  {saving ? 'Saving...' : editId ? 'Update Category' : 'Create Category'}
                </button>
                <button type="button" className="btn-outline" onClick={resetForm}>Cancel</button>
              </div>
            </form>
          </div>
        ) : (
          <button className="btn-primary" onClick={() => setShowForm(true)} id="add-category-btn">
            <FiPlus size={18} /> Add Category
          </button>
        )}

        {/* Category List */}
        <div className="admin-table">
          {categories.length === 0 ? (
            <div className="empty-state">
              <FiGrid size={48} />
              <h3>No categories yet</h3>
              <p>Create your first category to get started.</p>
            </div>
          ) : (
            categories.map((cat) => (
              <div key={cat.id} className="admin-row" id={`admin-cat-${cat.id}`}>
                <div className="admin-row-info">
                  <h4>{cat.name}</h4>
                  <p>{cat.description || 'No description'}</p>
                  {cat.slug && <span className="admin-slug">/{cat.slug}</span>}
                </div>
                <div className="admin-row-actions">
                  <button className="btn-outline btn-sm" onClick={() => handleEdit(cat)} id={`edit-cat-${cat.id}`}>
                    <FiEdit2 size={14} /> Edit
                  </button>
                  <button className="btn-icon-danger" onClick={() => handleDelete(cat.id, cat.name)} id={`delete-cat-${cat.id}`}>
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
