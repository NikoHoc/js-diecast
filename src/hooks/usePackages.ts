import { useState, useEffect, useCallback } from 'react';
import { api, getImageUrl } from '@/services/api';

export function usePackages() {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPackages = useCallback(async () => {
    setLoading(true);
    try {
      const result = await api.get<any>('/catalog/packages');

      if (result?.success && Array.isArray(result?.data)) {
        const formatted = result.data.map((item: any) => ({
          ...item,
          photo: getImageUrl(item.photo),
        }));
        setPackages(formatted);
      }
    } catch (error) {
      console.log('Error fetch packages:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPackages();
  }, [loadPackages]);

  return { packages, loading, refetch: loadPackages };
}