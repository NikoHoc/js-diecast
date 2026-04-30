const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL; 

let currentAuthToken: string | null = null;

export const api = {
  setAuthToken: (token: string | null) => {
    currentAuthToken = token;
  },

  getHeaders: () => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    if (currentAuthToken) {
      headers['X-Api-Key'] = currentAuthToken;
    }
    
    return headers;
  },

  get: async <T = any>(endpoint: string): Promise<T> => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: api.getHeaders(),
    });
    return response.json();
  },

  post: async <T = any>(endpoint: string, data?: any): Promise<T> => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: api.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });
    return response.json();
  },

  put: async <T = any>(endpoint: string, data?: any): Promise<T> => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: api.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });
    return response.json();
  },

  delete: async <T = any>(endpoint: string): Promise<T> => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: api.getHeaders(),
    });
    return response.json();
  },
};

export const getImageUrl = (path: string | null) => {
  if (!path || path === '' || path.includes('noimage.jpg')) {
    return null;
  }
  
  if (path.startsWith('http')) return path;
  
  return `${BASE_URL}/${path}`;
};