export const PRODUCT_FILTER_CATEGORIES = ['Semua', 'Ready', 'PO', 'Paket'];

export interface BaseResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  meta?: any;
}

export type User = {
  id: string | number;
  phone: string;
  store_name: string;
  name?: string;
  membership_tier?: number;
  total_point?: number;
};

export type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (token: string, userData: User) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
};

export interface Brand {
  id: number;
  uid: string;
  name: string;
  logo: string | null;
}

export interface ProductStorage {
  stock: string | number;
  storage_name: string;
}

export interface Product {
  id: string | number;
  code?: string;
  name: string;
  selling_price: string | number;
  stock: string | number;
  photo: string | null;
  is_po?: string | number;
  po_status?: string | null;
  brand_name?: string;
  group_name?: string;
  
  // Field get detail product
  product_master_id?: string | number;
  product_group_id?: string | number;
  brand_id?: string | number;
  description?: string | null;
  po_selling_price?: string | number;
  ready_selling_price?: string | number;
  master_name?: string;
  master_photo1?: string | null;
  master_photo2?: string | null;
  storages?: ProductStorage[];
}

export interface PackageItem {
  id: string;
  package_id: string;
  product_id: string;
  quantity: string;
  percentage_discount?: string;
  product_name: string;
  code?: string;
  selling_price: string;
  stock: string;
  photo: string | null;
  stock_sufficient?: boolean;
}

export interface Package {
  id: string | number;
  uid: string;
  name: string;
  price: string | number;
  total_discount?: string | number;
  stock_quantity: string | number;
  stock_sold?: string | number;
  image: string | null;
  is_active: string | number;
  stock_available?: string | number;
  available?: boolean;
  items?: PackageItem[];
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
