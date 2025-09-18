import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
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

// Algorithm API calls
export const algorithmApi = {
  getAll: (params = {}) => api.get('/algorithms', { params }),
  getBySlug: (slug) => api.get(`/algorithms/${slug}`),
  getCategories: () => api.get('/algorithms/meta/categories'),
  getDifficulties: () => api.get('/algorithms/meta/difficulties'),
};

// User API calls
export const userApi = {
  register: (userData) => api.post('/users/register', userData),
  login: (credentials) => api.post('/users/login', credentials),
  getProfile: () => api.get('/users/profile'),
};

// Progress API calls
export const progressApi = {
  getAll: () => api.get('/progress'),
  getByAlgorithm: (algorithmId) => api.get(`/progress/${algorithmId}`),
  update: (algorithmId, progressData) => api.post(`/progress/${algorithmId}`, progressData),
  getStats: () => api.get('/progress/stats/overview'),
};

export default api;
