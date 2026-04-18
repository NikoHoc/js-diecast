import { useState, useEffect, useCallback } from 'react';
import { api, getImageUrl } from '@/services/api';
import { BaseResponse, Product } from '@/types';

export function useProducts(brandId: number) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const result = await api.get<BaseResponse<Product[]>>(`/product?brand_id=${brandId}`);
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
    if (brandId) {
      loadProducts();
    }
  }, [brandId, loadProducts]);

  return { products, loading };
}