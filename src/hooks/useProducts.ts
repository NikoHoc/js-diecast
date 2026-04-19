import { useState, useEffect, useCallback } from 'react';
import { api, getImageUrl } from '@/services/api';
import { BaseResponse, Product } from '@/types';

export function useProducts(brandId?: number, searchQuery?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      let endpoint = '/product';
      const queryParams: string[] = [];
      if (brandId) {
        queryParams.push(`brand_id=${brandId}`);
      }
      if (searchQuery) {
        queryParams.push(`search=${encodeURIComponent(searchQuery)}`);
      }
      if (queryParams.length > 0) {
        endpoint += `?${queryParams.join('&')}`;
      }

      console.log('Fetching endpoint:', endpoint);

      const result = await api.get<BaseResponse<Product[]>>(endpoint);

      if (result.success) {
        const formattedProducts = result.data.map(item => ({
          ...item,
          photo: getImageUrl(item.photo)
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