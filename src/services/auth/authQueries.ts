import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import { axiosInstance } from '@/services/axiosInstance';

import { UserInfo } from '@/types';

// 로그인 검증
export const loginCheck = () => axiosInstance.get('/login/check');

// 리프레시 토큰
export const getNewAccessToken = () => axiosInstance.get('/login/refresh');

// 회원 탈퇴
export const leaveMemberShip = (userId: number) => {
  return axiosInstance.put('/login/leave', { userId });
};

// 나의 회원 정보
export const useGetUserInfo = (options?: UseQueryOptions) => {
  const getUserInfo = () => axiosInstance.get('/user');

  return useQuery({
    queryKey: ['userInfo'],
    queryFn: getUserInfo,
    ...options,
  });
};

// 나의 회원 정보
export const usePostUserInfo = (data: UserInfo, options?: UseQueryOptions) => {
  const postUserInfo = () => axiosInstance.post('/user', data);

  return useQuery({
    queryKey: ['userInfo', data],
    queryFn: postUserInfo,
    ...options,
  });
};

// 나의 회원 정보 수정
export const useUpdateUserInfo = (
  data: UserInfo,
  options?: UseQueryOptions,
) => {
  const updateUserInfo = () => axiosInstance.put('/user', data);

  return useQuery({
    queryKey: ['editUserInfo', data],
    queryFn: updateUserInfo,
    ...options,
  });
};
