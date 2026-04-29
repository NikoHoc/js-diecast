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

      const endpoint = `/catalog/products${params.toString() ? `?${params.toString()}` : ''}`;

      const result = await api.get<BaseResponse<Product[]>>(endpoint);

      const formattedProducts = result.data.map((item: any) => ({
        ...item,
        photo: getImageUrl(item.photo),
        brand: {
          id: item.brand?.id || item.brand_id || 0,
          name: item.brand?.name || item.brand_name || 'Pabrikan',
        },
      }));
      setProducts(formattedProducts);
      
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
