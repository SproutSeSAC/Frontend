import { UseMutationOptions, useMutation } from '@tanstack/react-query';

import { axiosInstance } from '@/services/axiosInstance';

import { RoleKey } from '@/types';

type ChangeUserPhoneNumber = {
  userId: number;
  phoneNumber: string;
};

type ChangeUserRole = {
  userId: number;
  role: RoleKey;
};

type ChangeTraineeMemo = {
  traineeId: number;
  content: string;
};

export const usePatchUserToManagePhoneNumber = (
  options?: UseMutationOptions<unknown, Error, ChangeUserPhoneNumber>,
) => {
  const postUserToManagePhoneNumber = async ({
    userId,
    phoneNumber,
  }: ChangeUserPhoneNumber) => {
    await axiosInstance.patch(`/admin/users/${userId}`, { phoneNumber });
  };

  return useMutation<unknown, Error, ChangeUserPhoneNumber>({
    mutationFn: postUserToManagePhoneNumber,
    ...options,
  });
};

export const useDeleteUserToManage = (
  options?: UseMutationOptions<unknown, Error, { userId: number }>,
) => {
  const deleteUserToManage = async ({ userId }: { userId: number }) => {
    await axiosInstance.delete(`/admin/users/${userId}`);
  };

  return useMutation<unknown, Error, { userId: number }>({
    mutationFn: deleteUserToManage,
    ...options,
  });
};

export const useDeleteTraineeMemo = (
  options?: UseMutationOptions<unknown, Error, { traineeId: number }>,
) => {
  const deleteTraineeMemo = async ({ traineeId }: { traineeId: number }) => {
    await axiosInstance.delete(`/admin/users/trainees/${traineeId}/memo`);
  };

  return useMutation<unknown, Error, { traineeId: number }>({
    mutationFn: deleteTraineeMemo,
    ...options,
  });
};

export const usePatchUserToManageRole = (
  options?: UseMutationOptions<unknown, Error, ChangeUserRole>,
) => {
  const postUserToManageRole = async ({ userId, role }: ChangeUserRole) => {
    await axiosInstance.patch(`/admin/users/role/${userId}`, { role });
  };

  return useMutation<unknown, Error, ChangeUserRole>({
    mutationFn: postUserToManageRole,
    ...options,
  });
};

export const usePostTraineeMemo = (
  options?: UseMutationOptions<unknown, Error, ChangeTraineeMemo>,
) => {
  const postUserToManageRole = async ({
    traineeId,
    content,
  }: ChangeTraineeMemo) => {
    await axiosInstance.post(`/admin/users/trainees/${traineeId}/memo`, {
      content,
    });
  };

  return useMutation<unknown, Error, ChangeTraineeMemo>({
    mutationFn: postUserToManageRole,
    ...options,
  });
};
