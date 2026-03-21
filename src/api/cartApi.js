import api from './api';

export const getCart = () =>
  api.get('/cart');

export const addItemToCart = (productId, quantity = 1) =>
  api.post(`/cart/items?productId=${productId}&quantity=${quantity}`);

export const updateCartItem = (productId, quantity) =>
  api.put(`/cart/items/${productId}?quantity=${quantity}`);

export const removeCartItem = (productId) =>
  api.delete(`/cart/items/${productId}`);

export const clearCart = () =>
  api.delete('/cart');
