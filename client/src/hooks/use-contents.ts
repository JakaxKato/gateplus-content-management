import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { apiRequest } from '../lib/api';
import type { Content } from '../types/content';

export interface ContentQueryParams {
  search?: string;
  genre?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export function useContents(params: ContentQueryParams) {
  return useQuery({
    queryKey: ['contents', params],
    queryFn: () =>
      apiRequest<Content[]>('/contents', {
        query: {
          search: params.search,
          genre: params.genre,
          status: params.status,
          page: params.page,
          limit: params.limit,
        },
      }),
    placeholderData: keepPreviousData,
  });
}

export function useContent(id: string | undefined) {
  return useQuery({
    queryKey: ['content', id],
    queryFn: () => apiRequest<Content>(`/contents/${id}`),
    enabled: Boolean(id),
  });
}
