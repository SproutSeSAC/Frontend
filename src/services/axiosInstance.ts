import {
  getCalendarToken,
  getNewAccessToken,
} from '@/services/auth/authQueries';

import { redirectToLogin } from '@/App';
import { CALENDAR_TOKEN_KEY, HEADER_ACCESS_TOKEN_KEY } from '@/constants';
import { getCookie, setCookie } from '@/utils';
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
    const headers = new AxiosHeaders(config.headers);

    const accessToken = getCookie(HEADER_ACCESS_TOKEN_KEY);

    if (accessToken) {
      headers.set('Access-Token', accessToken);
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

      const handleRefreshCalendarToken = async () => {
        // NOTE: 에러처리 체크하기
        await axiosInstance.get('/oauth2/authorization/refresh');
        return axiosInstance(originalRequest);
      };

      const handleNewAccessToken = async () => {
        const res = await getNewAccessToken();

        if (res?.status !== 200) return redirectToLogin();

        const newAccessToken = res.data.access_token;
        originalRequest.headers['Access-Token'] = newAccessToken;
        setCookie(HEADER_ACCESS_TOKEN_KEY, newAccessToken, 1);

        return axiosInstance(originalRequest);
      };

      switch (error.response.status) {
        case 400:
          if (originalRequest.url === 'api/user/calendar') {
            return handleRefreshCalendarToken();
          }
          break;

        case 401:
          return handleNewAccessToken();

        case 404:
          return redirectToLogin();

        case 304:
          if (originalRequest.url !== '/api/login/check') {
            return handleNewAccessToken();
          }
          return redirectToLogin();

        default:
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
    const headers = new AxiosHeaders(config.headers || {});

    const calendarAccessToken = sessionStorage.getItem(CALENDAR_TOKEN_KEY);

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

    const handleCalendarToken = async () => {
      await getCalendarToken();
      return axiosCalendarInstance(originalRequest);
    };

    const handleNewAccessToken = async () => {
      const res = await getNewAccessToken();

      if (res?.status !== 200) return redirectToLogin();

      const newAccessToken = res.data.access_token;
      originalRequest.headers['Access-Token'] = newAccessToken;
      setCookie(HEADER_ACCESS_TOKEN_KEY, newAccessToken, 1);
      return axiosCalendarInstance(originalRequest);
    };

    if (error.response && !originalRequest.retry) {
      originalRequest.retry = true;

      /** Google Calendar API 에러 문서:
       * https://developers.google.com/workspace/calendar/api/guides/errors?hl=ko#errors_suggested_actions */
      switch (error.response.status) {
        case 400:
          return handleNewAccessToken();

        case 401:
          return handleCalendarToken();

        default:
          return error.response.data.error.message;
      }
    }
    return Promise.reject(error);
  },
);
