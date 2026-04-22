import { useState, useEffect, useCallback } from 'react';
import { api, getImageUrl } from '@/services/api';
import { BaseResponse, Product } from '@/types';

export function useProducts(brandId?: number, searchQuery?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      if (brandId) params.append('brand_id', String(brandId));
      if (searchQuery) params.append('search', searchQuery);

      const endpoint = `/product${params.toString() ? `?${params.toString()}` : ''}`;

      const result = await api.get<BaseResponse<Product[]>>(endpoint);

      if (result.success) {
        const formattedProducts = result.data.map((item) => ({
          ...item,
          photo: getImageUrl(item.photo?.includes('noimage.jpg') ? 'noimage.jpg' : `product_master/${item.photo}`),
        }));
        setProducts(formattedProducts);
      }
    } catch (error) {
      console.log('Error fetch products:', error);
    } finally {
      setLoading(false);
    }
  }, [brandId, searchQuery]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return { products, loading };
}
