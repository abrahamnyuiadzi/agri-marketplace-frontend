import { api } from './api';
import type { Category } from '../types';

export async function getCategories(): Promise<Category[]> {
  const { data } = await api.get<{ data: Category[] }>('/categories');
  return data.data;
}

export async function getCategory(id: number | string): Promise<Category> {
  const { data } = await api.get<{ data: Category }>(`/categories/${id}`);
  return data.data;
}

export async function createCategory(payload: Partial<Category>): Promise<Category> {
  const { data } = await api.post<{ data: Category }>('/categories', payload);
  return data.data;
}

export async function updateCategory(
  id: number | string,
  payload: Partial<Category>
): Promise<Category> {
  const { data } = await api.put<{ data: Category }>(`/categories/${id}`, payload);
  return data.data;
}

export async function deleteCategory(id: number | string): Promise<void> {
  await api.delete(`/categories/${id}`);
}