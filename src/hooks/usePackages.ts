import { useState, useEffect } from 'react';
import { catalogService } from '@/services/catalog';
import { Package } from '@/types';

export const usePackages = (searchQuery?: string) => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const result = await catalogService.getPackages({ search: searchQuery });
      if (result.success) {
        setPackages(result.data);
      } else {
        setError(result.message || 'Gagal memuat paket');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan jaringan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, [searchQuery]);

  return { packages, loading, error, refetch: fetchPackages };
};