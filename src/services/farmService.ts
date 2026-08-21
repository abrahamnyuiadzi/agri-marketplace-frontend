import { api } from './api';
import type { ApiEnvelope, Farm, LaravelPaginator } from '../types';

export async function getFarms(page = 1): Promise<LaravelPaginator<Farm>> {
  const { data } = await api.get<ApiEnvelope<LaravelPaginator<Farm>>>('/farms', {
    params: { page },
  });
  return data.data;
}

export async function getFarm(id: number | string): Promise<Farm> {
  const { data } = await api.get<ApiEnvelope<Farm>>(`/farms/${id}`);
  return data.data;
}

// Utilisé par le dashboard producteur : "mes exploitations"
export async function getMyFarms(): Promise<Farm[]> {
  const { data } = await api.get<ApiEnvelope<Farm[]>>('/producer/farms');
  return data.data;
}

export async function createFarm(payload: FormData): Promise<Farm> {
  const { data } = await api.post<ApiEnvelope<Farm>>('/farms', payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
}

export async function updateFarm(
  id: number | string,
  payload: FormData
): Promise<Farm> {
  payload.append('_method', 'PUT');
  const { data } = await api.post<ApiEnvelope<Farm>>(`/farms/${id}`, payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
}

export async function deleteFarm(id: number | string): Promise<void> {
  await api.delete(`/farms/${id}`);
}