import type { Product } from './product';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type DeliveryStatus =
  | 'pending'
  | 'preparing'
  | 'shipped'
  | 'in_transit'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'paid'
  | 'failed'
  | 'cancelled';

export interface OrderItem {
  id: number;
  product_id: number;
  product?: Product;
  quantity: number;
  price: number;
}

export interface Payment {
  id: number;
  order_id: number;
  method: 'flooz' | 'tmoney';
  amount: number | string;
  status: PaymentStatus;
  transaction_reference?: string | null;
  payment_phone?: string | null;
  paid_at?: string | null;
}

export interface Delivery {
  id: number;
  order_id: number;
  status: DeliveryStatus;
  tracking_code?: string | null;

  delivery_address: string;
  city: string;
  neighborhood?: string | null;

  delivery_person?: string | null;
  delivery_phone?: string | null;

  shipped_at?: string | null;
  delivered_at?: string | null;

  note?: string | null;

  created_at: string;
  updated_at: string;
}

export interface Order {
  id: number;
  buyer_id?: number | null;

  first_name: string;
  last_name: string;
  phone: string;
  email?: string | null;

  address: string;
  city: string;
  neighborhood?: string | null;
  note?: string | null;

  payment_method: 'flooz' | 'tmoney';
  payment_phone?: string | null;

  status: OrderStatus;
  total: number | string;

  items: OrderItem[];

  payment?: Payment | null;
  delivery?: Delivery | null;

  created_at: string;
  updated_at: string;
}