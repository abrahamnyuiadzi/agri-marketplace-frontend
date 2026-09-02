export type UserRole = 'visiteur' | 'buyer' | 'producer' | 'admin';

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  role: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  image_url?: string;
}

// export interface Farm {
//   id: number;
//   name: string;
//   description?: string;
//   location: string;
//   producer_id: number;
//   producer?: User;
//   image_url?: string;
//   created_at: string;
// }

export type FarmType = 'crop' | 'livestock' | 'mixed' | 'other';

export interface Farm {
  id: number;
  user_id: number;
  name: string;
  description?: string;
  location?: string;
  city?: string;
  country?: string;
  surface?: number;
  type?: string;
  image?: string | null;
  is_verified: boolean;
  owner?: User;
}

// export interface Product {
//   id: number;
//   name: string;
//   slug: string;
//   description: string;
//   price: number;
//   unit: string; // ex: "kg", "unité", "botte"
//   stock: number;
//   images: string[];
//   category_id: number;
//   category?: Category;
//   farm_id: number;
//   farm?: Farm;
//   created_at: string;
// }

export interface Product {
  id: number;
  user_id: number;
  farm_id: number;
  category_id: number;

  name: string;
  description: string;

  image: string | null;

  price: number;
  quantity: number;
  unit: string;
  is_available: boolean;

  category?: Category;
  farm?: Farm;
  user?: User;

  created_at: string;
  updated_at: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product?: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;

  buyer_id: number | null;

  first_name: string;
  last_name: string;
  phone: string;
  email?: string | null;

  address: string;
  city: string;
  neighborhood?: string | null;
  note?: string | null;

  payment_method: 'flooz' | 'tmoney';
  payment_phone: string;

  total: number;

  status: OrderStatus;

  items: OrderItem[];

  created_at: string;
  updated_at?: string;
}

// Panier local (avant transformation en commande)
export interface CartItem {
  product: Product;
  quantity: number;
}

// Enveloppe standard des réponses Laravel
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// export interface PaginatedResponse<T> {
//   data: T[];
//   meta: {
//     current_page: number;
//     last_page: number;
//     per_page: number;
//     total: number;
//   };
// }

// Enveloppe standard de TOUTES tes réponses Laravel
export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

// Forme exacte de la pagination Laravel (paginate()) une fois désenveloppée
export interface LaravelPaginator<T> {
  current_page: number;
  data: T[];
  first_page_url: string | null;
  last_page: number;
  last_page_url: string | null;
  next_page_url: string | null;
  prev_page_url: string | null;
  per_page: number;
  total: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
  role?: UserRole;
  terms_accepted: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
}