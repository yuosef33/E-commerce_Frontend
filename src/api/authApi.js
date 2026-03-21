import api from './api';

export const loginUser = (email, password) =>
  api.post('/auth/Login', { email, password });

export const registerUser = (name, email, password, phoneNumber) =>
  api.post('/auth/createUserOtp', { name, email, password, phoneNumber });

export const verifyOtp = (email, otp) =>
  api.post('/auth/verifyOtp', { email, otp });

export const refreshToken = (refreshToken) =>
  api.post('/auth/refresh-token', { refreshToken });

export const logoutUser = () =>
  api.post('/business/logout');
