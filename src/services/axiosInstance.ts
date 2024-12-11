import {
  getCalendarToken,
  getNewAccessToken,
} from '@/services/auth/authQueries';

import {
  ACCESS_TOKEN_KEY,
  CALENDAR_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
} from '@/constants';
import { getCookie, setCookie } from '@/utils';
import axios, {
  AxiosHeaders,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const accessToken = getCookie(ACCESS_TOKEN_KEY);
    const refreshToken = getCookie(REFRESH_TOKEN_KEY);

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
    const originalRequest = error.config;
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 304) &&
      !originalRequest.retry
    ) {
      originalRequest.retry = true;

      const response = await getNewAccessToken();
      const newAccessToken = response.data.access_token;

      originalRequest.headers['Access-Token'] = newAccessToken;

      setCookie(ACCESS_TOKEN_KEY, newAccessToken, 1);

      return axiosInstance(originalRequest);
    }
    // NOTE: 이외 에러 발생시 로그인 페이지로 이동시킬 예정
    return Promise.reject(error);
  },
);

export const axiosCalendarInstance = axios.create({
  baseURL: 'https://www.googleapis.com/calendar/v3',
});

axiosCalendarInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const calendarAccessToken = getCookie(CALENDAR_TOKEN_KEY);

    const headers = new AxiosHeaders(config.headers || {});

    headers.set('Authorization', `Bearer ${calendarAccessToken}`);

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

axiosCalendarInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async error => {
    const originalRequest = error.config;

    if (error.response && !originalRequest.retry) {
      originalRequest.retry = true;

      if (error.response.status === 401) {
        try {
          const response = await getCalendarToken();
          const newCalendarAccessToken = response.data.access_token;
          setCookie(CALENDAR_TOKEN_KEY, newCalendarAccessToken, 1);

          return await axiosCalendarInstance(originalRequest);
        } catch (refreshError) {
          console.error('refreshError', refreshError);
        }
      }
    }
    return Promise.reject(error);
  },
);
