import { useState, useCallback } from 'react';
import { materiService } from '@/services/materiService';
import { Materi, MateriDetail, SubMateri, VideoMateri } from '@/types/materi';

export function useMateri() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [materials, setMaterials] = useState<Materi[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchMateriList = useCallback(async (
    page: number = 1,
    search?: string,
    limit: number = 10
  ) => {
    try {
      setLoading(true);
      setError(null);
      const response = await materiService.getMateriList({ page, search, limit });
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch materials');
      }

      const { materi, total } = response.data;
      setMaterials(prev => page === 1 ? materi : [...prev, ...materi]);
      setTotalItems(total);
      setCurrentPage(page);
      return response.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMateriDetail = useCallback(async (materiId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await materiService.getMateriDetail(materiId);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch material detail');
      }

      return response.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSubMateriList = useCallback(async (materiId: string, search?: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await materiService.getSubMateriList(materiId, search);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch sub materials');
      }

      return response.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchVideoMateriList = useCallback(async (materiId: string, search?: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await materiService.getVideoMateriList(materiId, search);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch video materials');
      }

      return response.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    materials,
    totalItems,
    currentPage,
    fetchMateriList,
    fetchMateriDetail,
    fetchSubMateriList,
    fetchVideoMateriList,
    hasMore: materials.length < totalItems
  };
}