import { useState, useCallback } from 'react';

interface PaginationState<T> {
  items: T[];
  loading: boolean;
  hasMore: boolean;
  cursor: string | null;
  error: string | null;
}

interface UsePaginationOptions {
  limit?: number;
  initialCursor?: string | null;
}

export function usePagination<T>(
  fetchFn: (cursor: string | null, limit: number) => Promise<{ items: T[]; nextCursor: string | null }>,
  options: UsePaginationOptions = {}
) {
  const { limit = 20, initialCursor = null } = options;
  
  const [state, setState] = useState<PaginationState<T>>({
    items: [],
    loading: false,
    hasMore: true,
    cursor: initialCursor,
    error: null
  });

  const loadMore = useCallback(async () => {
    if (state.loading || !state.hasMore) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await fetchFn(state.cursor, limit);
      
      setState(prev => ({
        ...prev,
        items: [...prev.items, ...result.items],
        cursor: result.nextCursor,
        hasMore: !!result.nextCursor,
        loading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load'
      }));
    }
  }, [fetchFn, state.cursor, state.loading, state.hasMore, limit]);

  const refresh = useCallback(async () => {
    setState({
      items: [],
      loading: false,
      hasMore: true,
      cursor: initialCursor,
      error: null
    });
    
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const result = await fetchFn(initialCursor, limit);
      
      setState({
        items: result.items,
        cursor: result.nextCursor,
        hasMore: !!result.nextCursor,
        loading: false,
        error: null
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load'
      }));
    }
  }, [fetchFn, initialCursor, limit]);

  const reset = useCallback(() => {
    setState({
      items: [],
      loading: false,
      hasMore: true,
      cursor: initialCursor,
      error: null
    });
  }, [initialCursor]);

  return {
    ...state,
    loadMore,
    refresh,
    reset
  };
}
