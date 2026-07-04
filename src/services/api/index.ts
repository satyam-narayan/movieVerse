import axios from 'axios';
import { DEFAULT_API_KEY, TMDB_BASE_URL } from '@/constants/config';

const apiKey = DEFAULT_API_KEY;

export const apiClient = axios.create({
  baseURL: TMDB_BASE_URL,
  timeout: 15000,
  headers: {
    'Accept': 'application/json',
  },
});


apiClient.interceptors.request.use(
  async (config) => {
    if (!apiKey || apiKey.trim() === '') {
      return Promise.reject(new Error('API_KEY_MISSING'));
    }

    const isBearerToken = apiKey.length > 50;
    if (isBearerToken) {
      config.headers.Authorization = `Bearer ${apiKey}`;
    } else {
      config.params = {
        ...config.params,
        api_key: apiKey,
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.message === 'API_KEY_MISSING') {
      return Promise.reject(new Error('API_KEY_MISSING'));
    }

    if (error.response) {
      if (error.response.status === 401) {
        return Promise.reject(new Error('UNAUTHORIZED'));
      }
      const serverMessage = error.response.data?.status_message;
      return Promise.reject(new Error(serverMessage || `API Error: ${error.response.status}`));
    }
    return Promise.reject(error);
  }
);

export default apiClient;
