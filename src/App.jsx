import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import CreateProductPage from './pages/CreateProductPage';
import AdminCategoriesPage from './pages/AdminCategoriesPage';
import { getCart } from './api/cartApi';
import './App.css';

function AppContent() {
  const [cartCount, setCartCount] = useState(0);

  const refreshCart = useCallback(async () => {
    try {
      const res = await getCart();
      setCartCount(res.data.data?.itemCount || 0);
    } catch {
      setCartCount(0);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) refreshCart();
  }, [refreshCart]);

  return (
    <>
      <Navbar cartCount={cartCount} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage refreshCart={refreshCart} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/products" element={<ProductsPage refreshCart={refreshCart} />} />
          <Route path="/products/new" element={<ProtectedRoute><CreateProductPage /></ProtectedRoute>} />
          <Route path="/products/:id" element={<ProductDetailPage refreshCart={refreshCart} />} />
          <Route path="/cart" element={<ProtectedRoute><CartPage refreshCart={refreshCart} /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><CheckoutPage refreshCart={refreshCart} /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
          <Route path="/admin/categories" element={<AdminRoute><AdminCategoriesPage /></AdminRoute>} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e1e2e',
              color: '#cdd6f4',
              border: '1px solid rgba(139, 92, 246, 0.3)',
            },
          }}
        />
        <AppContent />
      </AuthProvider>
    </Router>
  );
}
