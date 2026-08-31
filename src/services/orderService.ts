import { api } from './api';
import type { ApiEnvelope, Order } from '../types';

export interface CreateOrderItem {
  product_id: number;
  quantity: number;
}

export interface CreateOrderPayload {
  first_name: string;
  last_name: string;
  phone: string;
  email?: string;

  address: string;
  city: string;
  neighborhood?: string;
  note?: string;

  payment_method: 'flooz' | 'tmoney';
  payment_phone: string;

  items: CreateOrderItem[];
}

export async function createOrder(
  payload: CreateOrderPayload
): Promise<Order> {
  const { data } = await api.post<ApiEnvelope<Order>>(
    '/orders',
    payload
  );

  return data.data;
}