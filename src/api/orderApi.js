import api from './api';

export const checkout = (shippingAddress, city, country) =>
  api.post('/orders/checkout', { shippingAddress, city, country });

export const getMyOrders = () =>
  api.get('/orders');

export const getOrderById = (id) =>
  api.get(`/orders/${id}`);
