import { useState, useEffect } from 'react';
import { api, getImageUrl } from '@/services/api';
import { BaseResponse, Brand, Product } from '@/types';

export function useHomeStats() {
  const [topBrands, setTopBrands] = useState<Brand[]>([]);
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const [brandsRes, productsRes] = await Promise.all([
        api.get<BaseResponse<any>>('/stats/top-brands?days=30&limit=10'),
        api.get<BaseResponse<any>>('/stats/top-products?days=30&limit=10')
      ]);

      if (brandsRes && brandsRes.success) {
        const formattedBrands: Brand[] = brandsRes.data.map((b: any) => ({
          id: Number(b.brand_id),
          name: b.name,
          logo: b.logo ? getImageUrl(`brand/${b.logo}`) : getImageUrl(null)
        }));
        setTopBrands(formattedBrands);
      }

      if (productsRes && productsRes.success) {
        const formattedProducts: Product[] = productsRes.data.map((p: any) => ({
          id: Number(p.product_id),
          name: p.name,
          selling_price: p.selling_price,
          photo: getImageUrl(p.photo.includes('noimage.jpg') ? 'noimage.jpg' : `product_master/${p.photo}`),
          total_transactions: p.total_transactions,
          total_quantity: p.total_quantity,
          brand: {
            name: p.brand_name 
          }
        }));
        setTopProducts(formattedProducts);
      }
    } catch (err: any) {
      setError('Gagal memuat data statistik');
      console.log("error loading stats: ", err.message)
    } finally {
      setLoading(false);
    }
  };

  return { topBrands, topProducts, loading, error, refetch: loadStats };
}