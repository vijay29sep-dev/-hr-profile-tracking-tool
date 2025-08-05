import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api'  // Use relative path in production
  : process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
};

// Profiles API
export const profilesApi = {
  getAll: (params) => api.get('/profiles', { params }),
  getById: (id) => api.get(`/profiles/${id}`),
  create: (data) => api.post('/profiles', data),
  updateStatus: (id, data) => api.put(`/profiles/${id}/status`, data),
};

// Evaluations API
export const evaluationsApi = {
  create: (profileId, data) => api.post(`/profiles/${profileId}/evaluations`, data),
  update: (id, data) => api.put(`/evaluations/${id}`, data),
};

// Dashboard API
export const dashboardApi = {
  getStats: () => api.get('/dashboard/stats'),
};

export default api;