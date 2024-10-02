import { UseMutationOptions, useMutation } from '@tanstack/react-query';

import { axiosInstance } from '@/services/axiosInstance';

import { UpdateableUserProfile, UserInfo } from '@/types';

// eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiIxNCIsImlzRXNzZW50aWFsIjp0cnVlLCJleHAiOjE3Mjc4OTIzNTQsImlhdCI6MTcyNzg4ODc1NH0.eQgAvRRnpPIwUgOzGFArSJCN5Nf7NRcKaga-i5RjVW4MnWTn-UUHzZhWXvWuV526

export const usePostUserInfo = (
  options?: UseMutationOptions<unknown, Error, UserInfo, unknown>,
) => {
  const postUserInfo = async (formData: UserInfo) => {
    await axiosInstance.post('/user/register', formData);
  };

  return useMutation<unknown, Error, UserInfo, unknown>({
    mutationFn: postUserInfo,
    mutationKey: ['posts'],
    ...options,
  });
};

// 나의 회원 정보 수정
export const useUpdateUserProfile = (
  options?: UseMutationOptions<
    unknown,
    Error,
    Partial<UpdateableUserProfile>,
    unknown
  >,
) => {
  const updateUserProfile = (formData: Partial<UpdateableUserProfile>) =>
    axiosInstance.put('/user/update', formData);

  return useMutation({
    mutationFn: updateUserProfile,
    mutationKey: ['updateUserProfile'],
    ...options,
  });
};

// 회원 탈퇴
export const leaveMemberShip = (userId: number) => {
  return axiosInstance.put('/login/leave', { userId });
};
