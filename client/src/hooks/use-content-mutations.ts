import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../lib/api';
import type { ContentPayload } from '../lib/content-form';
import type { Content } from '../types/content';

export function useCreateContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ContentPayload) =>
      apiRequest<Content>('/contents', { method: 'POST', body: payload, auth: true }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['contents'] });
    },
  });
}

export function useUpdateContent(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ContentPayload) =>
      apiRequest<Content>(`/contents/${id}`, { method: 'PUT', body: payload, auth: true }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['contents'] });
      void queryClient.invalidateQueries({ queryKey: ['content', id] });
    },
  });
}

export function useDeleteContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiRequest<null>(`/contents/${id}`, { method: 'DELETE', auth: true }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['contents'] });
    },
  });
}
