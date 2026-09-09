import { api } from './api';
import type { Delivery } from '../types/order';

interface DeliveryResponse {
  success: boolean;
  data: Delivery;
}

interface DeliveriesResponse {
  success: boolean;
  data: {
    data: Delivery[];
    current_page: number;
    last_page: number;
    total: number;
  };
}

export async function getMyDeliveries(): Promise<Delivery[]> {
  const { data } = await api.get<DeliveriesResponse>(
    '/my-deliveries'
  );

  return data.data.data;
}

export async function getDelivery(
  deliveryId: number
): Promise<Delivery> {
  const { data } = await api.get<DeliveryResponse>(
    `/deliveries/${deliveryId}`
  );

  return data.data;
}