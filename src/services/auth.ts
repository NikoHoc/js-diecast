import { api } from './api';
import { BaseResponse, User } from '@/types';

export interface LoginRequest {
  phone: string;
  password?: string; 
}

export interface RegisterRequest {
  phone: string;
  store_name: string;
  name?: string;
}

export interface VerifyOtpRequest {
  phone: string;
  otp_code: string;
  password: string;
}

export interface AuthResponseData {
  api_key: string;
  customer: User;
}

export const authService = {
  login: async (data: LoginRequest) => {
    return await api.post<BaseResponse<AuthResponseData>>('/auth/login', data);
  },

  register: async (data: RegisterRequest) => {
    return await api.post<BaseResponse<any>>('/auth/register', data);
  },

  verifyOtp: async (data: VerifyOtpRequest) => {
    return await api.post<BaseResponse<AuthResponseData>>('/auth/verify_otp', data);
  },

  requestOtp: async (phone: string) => {
    return await api.post<BaseResponse<any>>('/auth/request_otp', { phone });
  }
};