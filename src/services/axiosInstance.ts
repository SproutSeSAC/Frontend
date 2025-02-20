import {
  getCalendarToken,
  getNewAccessToken,
} from '@/services/auth/authQueries';

import { redirectToLogin } from '@/App';
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
    const headers = new AxiosHeaders(config.headers);
    const accessToken = getCookie(ACCESS_TOKEN_KEY);
    const refreshToken = getCookie(REFRESH_TOKEN_KEY);

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
  error => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async error => {
    const originalRequest = error.config;
    if (error.response && !originalRequest.retry) {
      originalRequest.retry = true;

      const handleNewAccessToken = async () => {
        const response = await getNewAccessToken();

        if (response?.status && response.status !== 200)
          return redirectToLogin();

        const newAccessToken = response.data.access_token;
        originalRequest.headers['Access-Token'] = newAccessToken;
        setCookie(ACCESS_TOKEN_KEY, newAccessToken, 1);

        return axiosInstance(originalRequest);
      };

      switch (error.response.status) {
        case 401:
        case 304:
          return handleNewAccessToken();
        case 404:
          return redirectToLogin();
        case 500:
          return alert('서버에 문제가 발생했습니다. 나중에 다시 시도해주세요.');
        default:
        // alert(
        //   `예상치 못한 에러가 발생했습니다. (코드: ${error.response.status})`,
        // );
        // return redirectToLogin();
      }
    }
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
  error => Promise.reject(error),
);

axiosCalendarInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async error => {
    const originalRequest = error.config;

    if (error.response && !originalRequest.retry) {
      originalRequest.retry = true;

      const handleCalendarToken = async () => {
        const response = await getCalendarToken();
        if (response?.status && response.status !== 200) {
          return redirectToLogin();
        }

        const newCalendarAccessToken = response.data.access_token;
        setCookie(CALENDAR_TOKEN_KEY, newCalendarAccessToken, 1);
        return axiosCalendarInstance(originalRequest);
      };

      switch (error.response.status) {
        case 400:
        case 401:
          return handleCalendarToken();
        case 403:
          return Promise.resolve({ data: [] });
        default:
          console.error(
            `Unexpected error occurred. (Code: ${error.response.status})`,
          );
          return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);
