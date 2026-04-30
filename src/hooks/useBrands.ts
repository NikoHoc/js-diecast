import { useState, useEffect } from 'react';
import { catalogService } from '@/services/catalog';
import { Brand } from '@/types';

export const useBrands = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const result = await catalogService.getBrands();
      if (result.success) {
        setBrands(result.data);
      } else {
        setError(result.message || 'Gagal memuat brand');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan jaringan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  return { brands, loading, error, refetch: fetchBrands };
};