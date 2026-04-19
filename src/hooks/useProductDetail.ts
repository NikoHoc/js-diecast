import { useState, useEffect, useCallback } from 'react';
import { api, getImageUrl } from '@/services/api';
import { BaseResponse } from '@/types';

export function useProductDetail(productId: number) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadProductDetail = useCallback(async () => {
    setLoading(true);
    try {
      const result = await api.get<BaseResponse<any>>(`/composite/product-detail?id=${productId}`);
      if (result.success) {
        const data = result.data;
        data.photo = getImageUrl(data.photo);
        setProduct(data);
      }
    } catch (error) {
      console.log('Error fetch detail:', error);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    if (productId) loadProductDetail();
  }, [productId, loadProductDetail]);

  return { product, loading };
}