export const PRODUCT_FILTER_CATEGORIES = ['Semua', 'Ready', 'PO', 'Paket'];

export interface BaseResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  meta?: any;
}

export interface Brand {
  id: number;
  uid: string;
  name: string;
  logo: string | null;
}

export interface Product {
  id: number;
  name: string;
  selling_price: number;
  photo: string | null;
  stock: number;
  brand?: {
    id: number;
    name: string;
    logo?: string | null;
  };
}

export interface MembershipTier {
  id: string;
  name: string;
  level: string;
  icon: string;
  iconColor: string;
  bgColor: string;
  borderColor: string;
  multiplier: string;
  minTransaction: string;
  dpRule: string;
  description: string; 
};
