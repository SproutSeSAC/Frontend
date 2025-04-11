import { useQuery } from '@tanstack/react-query';

import { axiosInstance } from '@/services/axiosInstance';

import { RoleKey, UserProfileDto } from '@/types';
import { UserManagementDto } from '@/types/admin/userToManageDto';

export type UserManagementFilter = {
  page: number;
  size: number;
  offset?: number;
  campusId?: number;
  courseId?: number;
  keyword?: string;
  roles?: RoleKey[];
};

export const useGetInfiniteUserList = (params: UserManagementFilter) => {
  const getUserList = async () => {
    const offset = (params.page - 1) * params.size;

    const { data } = await axiosInstance.get<UserManagementDto.GetUserList>(
      `/admin/users`,
      { params: { ...params, offset } },
    );

    return {
      userList: data.content,
      totalCounts: data.totalCount,
      totalPages: Math.ceil(data.totalCount / params.size),
    };
  };

  return useQuery({
    queryKey: ['useGetInfiniteUserList', params],
    queryFn: getUserList,
  });
};

export const useGetInfiniteTraineeList = (params: UserManagementFilter) => {
  const getUserList = async () => {
    const offset = (params.page - 1) * params.size;

    const { data } = await axiosInstance.get<UserManagementDto.GetUserList>(
      `/admin/users/trainees`,
      { params: { ...params, offset } },
    );

    return {
      userList: data.content,
      totalCounts: data.totalCount,
      totalPages: Math.ceil(data.totalCount / params.size),
    };
  };

  return useQuery({
    queryKey: ['useGetInfiniteTraineeList', params],
    queryFn: getUserList,
  });
};

export const useGetUserToManageInfo = ({ userId }: { userId: number }) => {
  const getUserToManage = async () => {
    const { data } = await axiosInstance.get<UserProfileDto.GetCard>(
      `/admin/users/${userId}`,
    );
    return data;
  };

  return useQuery({
    queryKey: ['useGetUserToManageInfo', userId],
    queryFn: getUserToManage,
  });
};
