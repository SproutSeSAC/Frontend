import { getCookie } from '@/utils';
import axios, { InternalAxiosRequestConfig } from 'axios';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = getCookie('Access-Token');
    const refreshToken = getCookie('Refresh-Token');

    if (accessToken && refreshToken) {
      config.headers.set('Access-Token', accessToken);
      config.headers.set('Refresh-Token', refreshToken);
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  },
);
