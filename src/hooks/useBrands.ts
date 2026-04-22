import { useState, useEffect } from 'react';
import { api, getImageUrl } from '@/services/api';
import { BaseResponse, Brand } from '@/types';

export function useBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      const result = await api.get<BaseResponse<Brand[]>>('/brand');
      if (result.success) {
        const formattedBrands = result.data.map(brand => ({
          ...brand,
          logo: brand.logo ? getImageUrl(`brand/${brand.logo}`) : getImageUrl(null)
        }));
        
        setBrands(formattedBrands);
      }
    } catch (error) {
      console.log('Error fetch brands:', error);
    } finally {
      setLoading(false);
    }
  };

  return { brands, loading };
}