import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL; 

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(async (config) => {
  try {
    const apiKey = await SecureStore.getItemAsync('user_api_key');
    if (apiKey) {
      config.headers['X-Api-Key'] = apiKey;
    }
  } catch (error) {
    console.error('Gagal mengambil API Key dari SecureStore:', error);
  }
  return config;
});

export const api = {
  get: async <T = any>(url: string) => {
    const response = await axiosInstance.get<T>(url);
    return response.data;
  },
  post: async <T = any>(url: string, data?: any) => {
    const response = await axiosInstance.post<T>(url, data);
    return response.data;
  },
  put: async <T = any>(url: string, data?: any) => {
    const response = await axiosInstance.put<T>(url, data);
    return response.data;
  },
  delete: async <T = any>(url: string) => {
    const response = await axiosInstance.delete<T>(url);
    return response.data;
  }
};

export const getImageUrl = (path: string | null) => {
  if (!path || path === '' || path.includes('noimage.jpg')) {
    return null;
  }
  
  if (path.startsWith('http')) return path;

  let cleanPath = path.startsWith('/') ? path.substring(1) : path;
  cleanPath = cleanPath.replace('uploads/', ''); 
  
  return `${BASE_URL}/image/${cleanPath}`;
};