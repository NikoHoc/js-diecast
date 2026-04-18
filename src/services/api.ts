import * as SecureStore from 'expo-secure-store';

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL; 
const API_KEY = process.env.EXPO_PUBLIC_API_KEY as string;

async function refreshToken(): Promise<boolean> {
  try {
    const refresh = await SecureStore.getItemAsync('refresh_token');
    if (!refresh) return false;

    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'X-API-Key': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refresh }),
    });

    const data = await res.json();
    if (data.success) {
      await SecureStore.setItemAsync('access_token', data.data.tokens.access_token);
      await SecureStore.setItemAsync('refresh_token', data.data.tokens.refresh_token);
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

export const api = {
  async request<T = any>(method: string, path: string, body: any = null): Promise<T> {
    let token = await SecureStore.getItemAsync('access_token');
    
    const headers: Record<string, string> = {
      'X-API-Key': API_KEY,
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const options: RequestInit = { method, headers };
    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      let res = await fetch(`${BASE_URL}${path}`, options);

      // Otomatis refresh token kalau dapat 401 (Unauthorized)
      if (res.status === 401 && token) {
        const refreshed = await refreshToken();
        if (refreshed) {
          token = await SecureStore.getItemAsync('access_token');
          headers['Authorization'] = `Bearer ${token}`;
          options.headers = headers;
          res = await fetch(`${BASE_URL}${path}`, options);
        }
      }

      return await res.json();
    } catch (error) {
      console.error("API Request Error:", error);
      throw error;
    }
  },

  get: <T = any>(path: string) => api.request<T>('GET', path),
  post: <T = any>(path: string, body: any) => api.request<T>('POST', path, body),
  put: <T = any>(path: string, body: any) => api.request<T>('PUT', path, body),
  delete: <T = any>(path: string) => api.request<T>('DELETE', path),
};

export const getImageUrl = (path: string | null) => {
  if (!path) return null;

  const cleanBaseUrl = BASE_URL?.replace(/\/$/, '');
  const cleanPath = path.replace(/^\//, '');
  return `${cleanBaseUrl}/${cleanPath}`;
};