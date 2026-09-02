import { api } from './api';
// import type { ApiEnvelope, LaravelPaginator, Product } from '../types';

import type {
  ApiEnvelope,
  LaravelPaginator,
  Product,
  Order,
} from '../types';


export interface ProductFilters {
  search?: string;
  category_id?: number;
  farm_id?: number;
  page?: number;
}

export async function getProducts(
  filters: ProductFilters = {}
): Promise<LaravelPaginator<Product>> {
  const { data } = await api.get<ApiEnvelope<LaravelPaginator<Product>>>(
    '/products',
    { params: filters }
  );
  return data.data;
}

export async function getProduct(id: number | string): Promise<Product> {
  const { data } = await api.get<ApiEnvelope<Product>>(`/products/${id}`);
  return data.data;
}

export async function createProduct(payload: FormData): Promise<Product> {
  const { data } = await api.post<ApiEnvelope<Product>>('/products', payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
}

export async function updateProduct(
  id: number | string,
  payload: FormData
): Promise<Product> {
  payload.append('_method', 'PUT');
  const { data } = await api.post<ApiEnvelope<Product>>(
    `/products/${id}`,
    payload,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return data.data;
}

export async function deleteProduct(id: number | string): Promise<void> {
  await api.delete(`/products/${id}`);
}

// Produits du producteur connecté (dashboard "Mes produits")
export async function getMyProducts(
  page = 1
): Promise<LaravelPaginator<Product>> {
  const { data } = await api.get<ApiEnvelope<LaravelPaginator<Product>>>(
    '/producer/products',
    { params: { page } }
  );
  return data.data;
}

export async function getProducerOrders(
  page = 1
): Promise<LaravelPaginator<Order>> {
  const { data } = await api.get<ApiEnvelope<LaravelPaginator<Order>>>(
    '/producer/orders',
    {
      params: { page },
    }
  );

  return data.data;
}

/**
 * Récupérer tous les produits pour l'administration
 */
export async function getAdminProducts(
  page = 1
): Promise<LaravelPaginator<Product>> {
  const { data } = await api.get<
    ApiEnvelope<LaravelPaginator<Product>>
  >('/admin/products', {
    params: {
      page,
    },
  });

  return data.data;
}

/**
 * Supprimer un produit depuis l'administration
 */
export async function deleteAdminProduct(
  id: number
): Promise<void> {
  await api.delete(`/admin/products/${id}`);
}