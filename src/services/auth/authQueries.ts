import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import { axiosInstance } from '@/services/axiosInstance';

import { UserInfo } from '@/types';

export const loginCheck = () => axiosInstance.get('/login/check');

export const usePostUserInfo = (data: UserInfo, options?: UseQueryOptions) => {
  const postUserInfo = () => axiosInstance.post('/user', data);

  return useQuery({
    queryKey: ['userInfo', data],
    queryFn: postUserInfo,
    ...options,
  });
};
