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
}
