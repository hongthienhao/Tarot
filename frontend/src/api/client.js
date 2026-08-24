import axios from 'axios';

const DEFAULT_API_ORIGIN = 'http://localhost:3000';

export const getApiBaseURL = () => {
  const rawUrl = import.meta.env.VITE_API_URL || DEFAULT_API_ORIGIN;
  const trimmedUrl = rawUrl.replace(/\/+$/, '');
  return /\/api\/v1$/.test(trimmedUrl) ? trimmedUrl : `${trimmedUrl}/api/v1`;
};

const apiClient = axios.create({
  baseURL: getApiBaseURL(),
  timeout: 90000, // 90s timeout to safely handle Render Free Tier cold starts
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: tự động đính kèm Authorization token
apiClient.interceptors.request.use((config) => {
  const storage = localStorage.getItem('auth-storage');
  if (storage) {
    try {
      const parsed = JSON.parse(storage);
      const token = parsed.state?.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.error('Error parsing auth-storage', e);
    }
  }
  return config;
});

// Response interceptor: trích xuất error.code từ response.data.code
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data) {
      // Trích xuất code từ API Error Contract: { code, message }
      error.code = error.response.data.code || error.code;
      error.serverMessage = error.response.data.message;
    }
    return Promise.reject(error);
  }
);

export default apiClient;
