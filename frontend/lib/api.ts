import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface User {
  email: string;
  full_name: string;
  allergies?: string[];
  health_conditions?: string[];
}

export interface Product {
  id: number;
  name: string;
  ean: string;
  ingredients: string;
  nutritional_info: {
    calories: number;
    sugar: number;
    sodium: number;
    protein: number;
    fat: number;
    carbs: number;
  };
  about: string;
  brand: string;
  category: string;
  image_url?: string;
  claims?: Array<{
    claim: string;
    reality: string;
    match: number;
  }>;
  consumption_recommendation?: string;
  side_effects?: string[];
  allergens?: string[];
}

export interface Analysis {
  id: number;
  product_id: number;
  reality_check: string;
  consumption_advice: string;
  health_implications: string;
  created_at: string;
}

export const auth = {
  login: async (email: string, password: string) => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
    const response = await api.post('/token', formData);
    localStorage.setItem('token', response.data.access_token);
    return response.data;
  },

  register: async (email: string, password: string, full_name: string) => {
    const response = await api.post('/users/', { email, password, full_name });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },
};

export const products = {
  search: async (query?: string, page = 1) => {
    const response = await api.get('/products/', {
      params: {
        search: query,
        skip: (page - 1) * 10,
        limit: 10,
      },
    });
    return response.data;
  },

  getByEan: async (ean: string) => {
    const response = await api.get(`/products/${ean}`);
    return response.data;
  },

  analyze: async (ean: string, name: string) => {
    const response = await api.post(`/products/analyze`, { ean, name });
    return response.data;
  },
};

export const user = {
  updatePreferences: async (allergies: string[], health_conditions: string[]) => {
    const response = await api.put('/users/me/preferences', {
      allergies,
      health_conditions,
    });
    return response.data;
  },

  addToFavorites: async (ean: string) => {
    const response = await api.post(`/users/me/favorites/${ean}`);
    return response.data;
  },

  getFavorites: async () => {
    const response = await api.get('/users/me/favorites');
    return response.data;
  },
};

export default api; 