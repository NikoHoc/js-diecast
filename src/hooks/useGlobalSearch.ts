import { useState, useEffect } from 'react';
import { catalogService } from '@/services/catalog';
import { Product, Package } from '@/types';

export const useGlobalSearch = (searchQuery: string, activeFilter: string, selectedBrandId?: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [poRooms, setPoRooms] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSearchResults = async () => {
    setLoading(true);
    setError(null);

    setProducts([]);
    setPackages([]);
    setPoRooms([]);

    try {
      const fetchProductsTask = async () => {
        const res = await catalogService.getProducts({ search: searchQuery, brand_id: selectedBrandId });
        if (res.success) {
          const readyProducts = res.data.filter((p) => p.is_po === "0" || p.is_po === 0);
          setProducts(readyProducts);
        }
      };

      const fetchPackagesTask = async () => {
        const res = await catalogService.getPackages({ search: searchQuery });
        if (res.success) {
           setPackages(res.data);
        }
      };

      const fetchPoRoomsTask = async () => {
        // Contoh eksekusi (bisa di-uncomment nanti):
        // const res = await catalogService.getPoRooms({ search: searchQuery, brand_id: selectedBrandId });
        // if (res.success) setPoRooms(res.data);
      };

      if (activeFilter === 'Semua') {
        await Promise.all([fetchProductsTask(), fetchPackagesTask(), fetchPoRoomsTask()]);
      } 
      else if (activeFilter === 'Ready') {
        await fetchProductsTask();
      } 
      else if (activeFilter === 'PO') {
        await fetchPoRoomsTask();
      } 
      else if (activeFilter === 'Paket') {
        await fetchPackagesTask();
      }

    } catch (err: any) {
      setError(err.message || 'Gagal melakukan pencarian');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSearchResults();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, activeFilter, selectedBrandId]);

  return { products, packages, poRooms, loading, error, refetch: fetchSearchResults };
};