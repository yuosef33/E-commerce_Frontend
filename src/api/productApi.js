import api from './api';

export const getProducts = (params = {}) => {
  const query = new URLSearchParams();
  if (params.categoryId) query.append('categoryId', params.categoryId);
  if (params.search) query.append('search', params.search);
  if (params.page !== undefined) query.append('page', params.page);
  if (params.size) query.append('size', params.size);
  return api.get(`/products?${query.toString()}`);
};

export const getProductById = (id) =>
  api.get(`/products/${id}`);

export const createProduct = (data) =>
  api.post('/products', data);

export const updateProduct = (id, data) =>
  api.put(`/products/${id}`, data);

export const deleteProduct = (id) =>
  api.delete(`/products/${id}`);
