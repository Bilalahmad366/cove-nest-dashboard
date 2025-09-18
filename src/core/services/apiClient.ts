import axios, { AxiosInstance } from 'axios';
import { getLocalStorage, removeLocalStorage } from './localStorage';
import router from '@/router';

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Authorization': getLocalStorage().token ? `Bearer ${getLocalStorage().token}` : '',
  }
});

// Request Interceptor: Ensures the latest token is used
apiClient.interceptors.request.use(
  (config) => {
    const token = getLocalStorage().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handles unauthorized requests
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeLocalStorage();
      router.push('/');
    }
    return Promise.reject(error);
  }
);

// 🔥 **Update Axios Token Dynamically on Storage Change**
window.addEventListener("storage", (event) => {
  if (event.key === "token") {
    if (event.newValue) {
      apiClient.defaults.headers.Authorization = `Bearer ${event.newValue}`;
    } else {
      delete apiClient.defaults.headers.Authorization;
    }
  }
});

export default apiClient;
