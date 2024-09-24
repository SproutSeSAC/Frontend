import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import { axiosInstance } from '@/services/axiosInstance';

import { UserInfo } from '@/types';

// 로그인 검증
export const loginCheck = () => axiosInstance.get('/login/check');

// 리프레시 토큰
export const getNewAccessToken = () => axiosInstance.get('/login/refresh');

// 나의 회원 정보
export const usePostUserInfo = (data: UserInfo, options?: UseQueryOptions) => {
  const postUserInfo = () => axiosInstance.post('/user', data);

  return useQuery({
    queryKey: ['userInfo', data],
    queryFn: postUserInfo,
    ...options,
  });
};
