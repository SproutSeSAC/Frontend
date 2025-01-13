import { UseMutationOptions, useMutation } from '@tanstack/react-query';

import { axiosInstance } from '@/services/axiosInstance';

import { UserProfileDto } from '@/types';

export const usePostSignUpValue = (
  options?: UseMutationOptions<unknown, Error, UserProfileDto.Post>,
) => {
  const postUserInfo = async (formData: UserProfileDto.Post) => {
    await axiosInstance.post('/user/register', formData);
  };

  return useMutation<unknown, Error, UserProfileDto.Post>({
    mutationFn: postUserInfo,
    mutationKey: ['posts'],
    ...options,
  });
};

export const useUpdateUserProfile = (
  options?: UseMutationOptions<unknown, Error, UserProfileDto.Update>,
) => {
  const updateUserProfile = (formData: UserProfileDto.Update) =>
    axiosInstance.put('/user/update', formData);

  return useMutation({
    mutationFn: updateUserProfile,
    mutationKey: ['updateUserProfile'],
    ...options,
  });
};

// 나의 프로필 이미지 업데이트하기
export const useUpdateProfileImage = (
  options?: UseMutationOptions<
    unknown,
    Error,
    UserProfileDto.UpdateProfileImage
  >,
) => {
  const updateProfileImage = (formData: UserProfileDto.UpdateProfileImage) =>
    axiosInstance.patch('/mypage/updateProfileUrl', formData);

  return useMutation({
    mutationFn: updateProfileImage,
    mutationKey: ['useUpdateProfileImage'],
    ...options,
  });
};

export const leaveMemberShip = () => {
  return axiosInstance.put('/login/leave');
};
