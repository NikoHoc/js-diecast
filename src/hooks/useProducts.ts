import { useState, useEffect } from 'react';
import { catalogService } from '@/services/catalog';
import { Product } from '@/types';

interface ProductFilters {
  category?: string;
  brand_id?: number | string;
  search?: string;
}

export const useProducts = (filters?: ProductFilters) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const result = await catalogService.getProducts(filters);
      if (result.success) {
        setProducts(result.data);
      } else {
        setError(result.message || 'Gagal memuat produk');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan jaringan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [JSON.stringify(filters)]);

  return { products, loading, error, refetch: fetchProducts };
};