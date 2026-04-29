import { useState, useEffect, useCallback } from 'react';
import { api, getImageUrl } from '@/services/api';
import { Product } from '@/types';

export function useProductDetail(productId: number) {
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  const loadProductDetail = useCallback(async () => {
    if (!productId) return;

    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('id', String(productId)); 
      
      const endpoint = `/catalog/products?${params.toString()}`;
      const result = await api.get<any>(endpoint);

      if (result?.success && result?.data) {
        const item = result.data;

        const formattedProduct: Product = {
          ...item,
          id: Number(item.id),
          selling_price: Number(item.selling_price),
          stock: Number(item.stock),
          
          photo: getImageUrl(item.photo),
          brand: {
            id: item.brand_id ? Number(item.brand_id) : 0,
            name: item.brand_name || 'Pabrikan'
          },
          description: item.description || item.notes || `Diecast ${item.name} dengan detail tingkat tinggi.`
        };
        
        setProduct(formattedProduct);
      }
    } catch (error) {
      console.log('Error fetch detail:', error);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    loadProductDetail();
  }, [loadProductDetail]);

  return { product, loading };
}