export const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL ?? '/api';

export const STORAGE_KEYS = {
  TOKEN: 'agri_auth_token',
  USER: 'agri_auth_user',
  CART: 'agri_cart',
} as const;

export const ROLES = {
  BUYER: 'buyer',
  PRODUCER: 'producer',
  ADMIN: 'admin',
} as const;