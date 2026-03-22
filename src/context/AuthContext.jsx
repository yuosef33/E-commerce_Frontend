import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, logoutUser } from '../api/authApi';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

// Safely decode JWT payload
function decodeToken(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

// Extract roles from JWT payload (Spring Security format)
function extractRoles(payload) {
  if (!payload) return [];
  // Try common claim names for authorities/roles
  const raw = payload.authorities || payload.roles || payload.role || payload.scope || [];
  if (typeof raw === 'string') return [raw];
  if (Array.isArray(raw)) {
    return raw.map((r) => (typeof r === 'string' ? r : r.authority || r.userRole || ''));
  }
  return [];
}

function buildUserData(payload, email) {
  const roles = extractRoles(payload);
  return {
    email: payload?.sub || email,
    name: payload?.name || email.split('@')[0],
    roles,
    isAdmin: roles.some((r) => r.toUpperCase().includes('ADMIN')),
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      } catch {
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await loginUser(email, password);
    const { accessToken, refreshToken } = res.data.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    const payload = decodeToken(accessToken);
    const userData = buildUserData(payload, email);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
    toast.success('Welcome back!');
    return res;
  };

  const register = async (name, email, password, phoneNumber) => {
    const res = await registerUser(name, email, password, phoneNumber);
    toast.success('OTP sent to your email!');
    return res;
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch {
      // Ignore — still clear local state
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
