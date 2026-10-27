import axios from 'axios';

// Normalize VITE_API_URL to ensure proper path resolution when hosted
const rawApiUrl = import.meta.env.VITE_API_URL;
let apiUrl = '/api';

if (rawApiUrl && typeof rawApiUrl === 'string' && rawApiUrl.trim() !== '') {
  apiUrl = rawApiUrl.trim().replace(/\/+$/, '');
  if (!apiUrl.endsWith('/api')) {
    apiUrl += '/api';
  }
}

const API = axios.create({
  baseURL: apiUrl,
  timeout: 30000
});

// Attach Authorization Bearer token to requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token.trim()}`;
  }
  return req;
});

// Handle expired or unauthorized sessions and transient network disconnects gracefully
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const config = error.config;

    // Retry transient network dropouts or server reload on GET requests once
    if (
      config &&
      !config._retry &&
      (!error.response || [502, 503, 504].includes(error.response?.status)) &&
      (!config.method || config.method.toLowerCase() === 'get')
    ) {
      config._retry = true;
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(API(config));
        }, 800);
      });
    }

    if (error.response && error.response.status === 401) {
      const url = error.config?.url || '';
      const isAuthAttempt =
        url.includes('/auth/login') ||
        url.includes('/auth/register') ||
        url.includes('/auth/google') ||
        url.includes('/auth/forgot-password');

      // Only invalidate session if this was a protected resource request, not the login form itself
      if (!isAuthAttempt) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);

export default API;