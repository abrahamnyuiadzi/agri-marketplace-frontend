import { api } from './api';
import type { ApiEnvelope, LaravelPaginator, Order, OrderStatus } from '../types';

export interface CreateOrderPayload {
  items: Array<{ product_id: number; quantity: number }>;
  shipping_address: string;
  phone: string;
}

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const { data } = await api.post<ApiEnvelope<Order>>('/orders', payload);
  return data.data;
}

// Historique des commandes du buyer connecté
export async function getMyOrders(): Promise<Order[]> {
  const { data } = await api.get<ApiEnvelope<Order[]>>('/orders/me');
  return data.data;
}

// Commandes reçues par le producteur connecté
export async function getProducerOrders(
  page = 1
): Promise<LaravelPaginator<Order>> {
  const { data } = await api.get<ApiEnvelope<LaravelPaginator<Order>>>(
    '/producer/orders',
    { params: { page } }
  );
  return data.data;
}

// Toutes les commandes (vue admin)
export async function getAllOrders(page = 1): Promise<LaravelPaginator<Order>> {
  const { data } = await api.get<ApiEnvelope<LaravelPaginator<Order>>>(
    '/admin/orders',
    { params: { page } }
  );
  return data.data;
}

export async function updateOrderStatus(
  id: number | string,
  status: OrderStatus
): Promise<Order> {
  const { data } = await api.patch<ApiEnvelope<Order>>(`/orders/${id}/status`, {
    status,
  });
  return data.data;
}