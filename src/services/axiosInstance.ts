import { getNewAccessToken } from '@/services/auth/authQueries';

import { getCookie, setCookie } from '@/utils';
import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = getCookie('access_token');
    const refreshToken = getCookie('refresh_token');

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

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async error => {
    if (error.response.status === 401) {
      const response = await getNewAccessToken();
      const newAccessToken = response.data;
      setCookie('access_token', newAccessToken, 1);
    }
    return Promise.reject(error);
  },
);
