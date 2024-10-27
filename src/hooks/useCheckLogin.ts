import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/constants';
import { getCookie } from '@/utils';

export const useCheckLogin = () => {
  const accessToken = getCookie(ACCESS_TOKEN_KEY);
  const refreshToken = getCookie(REFRESH_TOKEN_KEY);

  const isLogin = !!(accessToken && refreshToken);

  return {
    isLogin,
  };
};
