// File: src/hooks/useArticles.ts
import useSWR from 'swr';
import api from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';

export interface ArticleOption {
  id: number;
  ean: string;
  description: string;
  unit_price: number;
  tax_rate: number;
}

interface ArticlesResponse {
  articles: ArticleOption[];
  message?: string;
}

export function useArticles(): {
  articles: ArticleOption[];
  isLoading: boolean;
  isError: boolean;
} {
  const { user, initializing } = useAuth();
  const shouldFetch = !initializing && !!user;

  const { data, error } = useSWR<ArticlesResponse, Error>(
    shouldFetch ? '/articles' : null,
    () => api.get<ArticlesResponse>('/articles').then(r => r.data)
  );

  return {
    articles: data?.articles ?? [],
    isLoading: shouldFetch && !data && !error,
    isError: !!error,
  };
}
