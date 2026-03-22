import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { verifyOtp } from '../api/authApi';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiPhone, FiUserPlus, FiKey } from 'react-icons/fi';
import { stripHtml, isValidEmail, isValidName, isValidPhone, isValidPassword } from '../utils/security';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1 = fill form, 2 = enter OTP
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    const cleanName = stripHtml(name);
    const cleanEmail = stripHtml(email).toLowerCase();
    const cleanPhone = stripHtml(phoneNumber);
    if (!cleanName || !cleanEmail || !password || !cleanPhone) {
      toast.error('Please fill in all fields');
      return;
    }
    if (!isValidName(cleanName)) {
      toast.error('Name must be 2-50 characters, letters only');
      return;
    }
    if (!isValidEmail(cleanEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (!isValidPassword(password)) {
      toast.error('Password must be 8-128 characters');
      return;
    }
    if (!isValidPhone(cleanPhone)) {
      toast.error('Please enter a valid phone number (10-15 digits)');
      return;
    }
    setLoading(true);
    try {
      await register(cleanName, cleanEmail, password, cleanPhone);
      setStep(2);
      toast.success('OTP sent to your email!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const cleanOtp = stripHtml(otp).replace(/[^0-9a-zA-Z]/g, '');
    if (!cleanOtp) {
      toast.error('Please enter the OTP');
      return;
    }
    setLoading(true);
    try {
      await verifyOtp(stripHtml(email).toLowerCase(), cleanOtp);
      toast.success('Account created! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">{step === 1 ? <FiUserPlus size={28} /> : <FiKey size={28} />}</div>
          <h1>{step === 1 ? 'Create Account' : 'Verify Email'}</h1>
          <p>{step === 1 ? 'Join us and start shopping today' : `Enter the OTP sent to ${email}`}</p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="auth-form" id="register-form">
            <div className="input-group">
              <FiUser size={18} className="input-icon" />
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                id="register-name"
              />
            </div>
            <div className="input-group">
              <FiMail size={18} className="input-icon" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                id="register-email"
              />
            </div>
            <div className="input-group">
              <FiLock size={18} className="input-icon" />
              <input
                type="password"
                placeholder="Password (min 8 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                id="register-password"
              />
            </div>
            <div className="input-group">
              <FiPhone size={18} className="input-icon" />
              <input
                type="tel"
                placeholder="Phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                id="register-phone"
              />
            </div>
            <button type="submit" className="btn-primary btn-full" disabled={loading} id="register-submit">
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="auth-form" id="otp-form">
            <div className="input-group">
              <FiKey size={18} className="input-icon" />
              <input
                type="text"
                placeholder="Enter OTP code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                autoFocus
                id="otp-input"
              />
            </div>
            <button type="submit" className="btn-primary btn-full" disabled={loading} id="otp-submit">
              {loading ? 'Verifying...' : 'Verify & Create Account'}
            </button>
            <button
              type="button"
              className="btn-outline btn-full"
              onClick={() => setStep(1)}
              id="back-to-form"
            >
              Back
            </button>
          </form>
        )}

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
