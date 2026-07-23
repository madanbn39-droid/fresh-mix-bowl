import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // For secure cookies/refresh tokens
});

// Request interceptor for API calls
api.interceptors.request.use(
  async config => {
    // We can add token logic here later (e.g., getting from localStorage or cookies)
    return config;
  },
  error => {
    Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    // Handle 401 Unauthorized for refresh token logic later
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // Implement refresh token logic
      // const newToken = await refreshToken();
      // api.defaults.headers.common['Authorization'] = 'Bearer ' + newToken;
      // return api(originalRequest);
    }
    return Promise.reject(error);
  }
);

export default api;
