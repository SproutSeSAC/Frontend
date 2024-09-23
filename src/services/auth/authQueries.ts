import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import { axiosInstance } from '@/services/axiosInstance';

import { UserInfo } from '@/types';

export const useLoginCheck = () => {
  const loginCheck = () => axiosInstance.get('/login/check');

  return useQuery({
    queryKey: ['login'],
    queryFn: loginCheck,
  });
};

export const usePostUserInfo = (data: UserInfo, options?: UseQueryOptions) => {
  const postUserInfo = () => axiosInstance.post('/user', data);

  return useQuery({
    queryKey: ['userInfo'],
    queryFn: postUserInfo,
    ...options,
  });
};
