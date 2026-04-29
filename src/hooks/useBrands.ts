import { useState, useEffect, useCallback } from 'react';
import { api, getImageUrl } from '@/services/api';
import { BaseResponse, Brand } from '@/types';
import axios from 'axios';

export function useBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBrands = useCallback(async () => {
    try {
      // const result = await api.get<BaseResponse<Brand[]>>('/catalog/brands');

      const response = await axios.get('https://rapidlogic.online/api/v1/brand', {
        headers: {
          'X-Api-Key': 'jsd_live_f9b66c268a217557d6c4a6ae1a104c98' 
        }
      });
      const result = response.data;

      if (result?.success && result.data) {
        const formattedBrands = result.data.map((brand: Brand) => ({
          ...brand,
          logo: getImageUrl(brand.logo), // getImageUrl pintar akan menangani URL gambarnya
        }));
        setBrands(formattedBrands);
      }
    } catch (error) {
      console.log('Error fetch brands:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBrands();
  }, [loadBrands]);

  return { brands, loading };
}