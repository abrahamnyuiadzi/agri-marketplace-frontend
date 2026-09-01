import { api } from './api';
import type { User, LaravelPaginator, ApiEnvelope } from '../types';

/**
 * Récupérer tous les producteurs
 */
export async function getProducers(
  page = 1
): Promise<LaravelPaginator<User>> {
  const { data } = await api.get<ApiEnvelope<LaravelPaginator<User>>>(
    '/users',
    {
      params: {
        page,
      },
    }
  );

  return data.data;
}

/**
 * Récupérer un producteur
 */
export async function getProducer(
  id: number
): Promise<User> {
  const { data } = await api.get<ApiEnvelope<User>>(
    `/users/${id}`
  );

  return data.data;
}

/**
 * Modifier un producteur
 */
export async function updateProducer(
  id: number,
  payload: Partial<User>
): Promise<User> {
  const { data } = await api.put<ApiEnvelope<User>>(
    `/users/${id}`,
    payload
  );

  return data.data;
}

/**
 * Supprimer un producteur
 */
export async function deleteProducer(
  id: number
): Promise<void> {
  await api.delete(`/users/${id}`);
}