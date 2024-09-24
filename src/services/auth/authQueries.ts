import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from '@tanstack/react-query';

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

// 나의 회원 정보 얻기
export const useGetUserInfo = (options?: UseQueryOptions) => {
  const getUserInfo = () => axiosInstance.get('/user');

  return useQuery({
    queryKey: ['userInfo'],
    queryFn: getUserInfo,
    ...options,
  });
};

// 나의 회원 정보 입력
export const usePostUserInfo = (
  options?: UseMutationOptions<unknown, Error, UserInfo, unknown>,
) => {
  const postUserInfo = async (formData: UserInfo) => {
    await axiosInstance.post('/user', formData);
  };

  return useMutation<unknown, Error, UserInfo, unknown>({
    mutationFn: postUserInfo,
    mutationKey: ['posts'],
    onSuccess: (data, variables, context) => {
      console.log('onSuccess', data, variables, context);
    },
    onSettled: (data, error, variables, context) => {
      console.log('onSettled', data, error, variables, context);
    },
    retry: 3,
    retryDelay: 500,
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
