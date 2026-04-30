// src/hooks/useProductDetail.ts
import { useState, useEffect } from 'react';
import { catalogService } from '@/services/catalog';
import { Product } from '@/types';

export const useProductDetail = (id: string | number) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await catalogService.getProductDetail(id);
      
      if (result.success && result.data) {
        setProduct(result.data);
      } else {
        setError(result.message || 'Gagal memuat detail produk');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan jaringan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  return { product, loading, error, refetch: fetchDetail };
};