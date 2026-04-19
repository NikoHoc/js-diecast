import { useState, useEffect, useCallback } from 'react';
import { api, getImageUrl } from '@/services/api';
import { BaseResponse, Product } from '@/types';

export function useProducts(brandId?: number) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const endpoint = brandId ? `/product?brand_id=${brandId}` : '/product';
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
  }, [brandId]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return { products, loading };
}