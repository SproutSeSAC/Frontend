import { getNewAccessToken } from '@/services/auth/authQueries';

import { getCookie } from '@/utils';
import axios, {
  AxiosHeaders,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const accessToken = getCookie('access_token');
    const refreshToken = getCookie('refresh_token');

    const headers = new AxiosHeaders(config.headers);

    if (accessToken) {
      headers.set('Access-Token', accessToken);
    }
    if (refreshToken) {
      headers.set('Refresh-Token', refreshToken);
    }

    const modifiedConfig: InternalAxiosRequestConfig = {
      ...config,
      headers,
    };

    return modifiedConfig;
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
    if (error.response && error.response.status === 401) {
      try {
        const response = await getNewAccessToken();
        const newAccessToken = response.data.accessToken;

        const modifiedErrorConfig: InternalAxiosRequestConfig = {
          ...error.config,
          headers: {
            ...error.config.headers,
            'Access-Token': newAccessToken,
          },
        };

        return await axiosInstance(modifiedErrorConfig);
      } catch (refreshError) {
        console.error('failed to refresh token:', refreshError);
      }
    }
    return Promise.reject(error);
  },
);
