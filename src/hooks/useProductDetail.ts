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
      if (result.success && result.data) {
        const data = result.data;
        
        if (data.photo && !data.photo.startsWith('http')) {
          let cleanMain = data.photo.replace('uploads/', '');
          cleanMain = cleanMain.includes('noimage.jpg') ? 'noimage.jpg' : `product_master/${cleanMain}`;
          data.photo = getImageUrl(cleanMain);
        } else {
          data.photo = getImageUrl(data.photo);
        }

        let galleryUrls: string[] = [];
        if (data.product_master) {
          const pm = data.product_master;
          const pmPhotos = [pm.photo1, pm.photo2, pm.photo3, pm.photo4, pm.photo5];
          
          pmPhotos.forEach(p => {
            if (p && p !== '' && !p.includes('noimage.jpg')) {
              const cleanP = p.replace('uploads/', '');
              galleryUrls.push(getImageUrl(`product_master/${cleanP}`));
            }
          });
        }
        
        if (galleryUrls.length === 0) {
          galleryUrls.push(data.photo);
        }
        
        data.photos = galleryUrls; 

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