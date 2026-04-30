import { api } from './api';
import { BaseResponse, Product, Brand, MembershipTier, Package, PackageItem } from '@/types';


export interface SearchResult {
  products: Product[];
  packages: Package[];
}

export const catalogService = {
  getBrands: async () => {
    return await api.get<BaseResponse<Brand[]>>('/catalog/brands');
  },

  getProducts: async (params?: { brand_id?: number | string; search?: string }) => {
    const cleanParams = Object.fromEntries(
      Object.entries(params || {}).filter(([_, v]) => v != null && v !== '')
    );
    const query = new URLSearchParams(cleanParams as any).toString();
    const endpoint = query ? `/catalog/products?${query}` : '/catalog/products';
    return await api.get<BaseResponse<Product[]>>(endpoint);
  },

  getProductDetail: async (id: number | string) => {
    return await api.get<BaseResponse<Product>>(`/catalog/products/${id}`);
  },

  getPackages: async (params?: { search?: string }) => {
    const query = params?.search ? `?search=${params.search}` : '';
    return await api.get<BaseResponse<Package[]>>(`/catalog/packages${query}`);
  },

  getPackageDetail: async (id: number | string) => {
    return await api.get<BaseResponse<Package>>(`/catalog/packages/${id}`);
  },

  getMembershipTiers: async () => {
    return await api.get<BaseResponse<MembershipTier[]>>('/catalog/membership');
  }
};