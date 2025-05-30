import { useQuery } from '@tanstack/react-query';

import { axiosInstance } from '@/services/axiosInstance';

import {
  PaginationFilter,
  RoleKey,
  SessionDto,
  UserComment,
  UserManagementTabType,
  UserProfileDto,
} from '@/types';
import { UserManagementDto } from '@/types/admin/userToManageDto';

import { UserCollection } from '@/pages/admin/UserPostCollection';

export type UserManagementFilter = {
  page: number;
  size: number;
  offset?: number;
  campusId?: number;
  courseId?: number;
  keyword?: string;
  roles?: RoleKey[];
};

/** 사용자 목록 조회 */
export const useGetInfiniteUserList = (
  currTab: UserManagementTabType,
  params: UserManagementFilter,
) => {
  const getUserList = async () => {
    const offset = (params.page - 1) * params.size;

    const { data } = await axiosInstance.get<UserManagementDto.GetUserList>(
      `/admin/users`,
      { params: { ...params, offset } },
    );

    return {
      userList: data.content.map(user => ({
        ...user,
        campus: user.campus.sort((a, b) => a.name.localeCompare(b.name)),
        course: user.course.sort((a, b) => a.name.localeCompare(b.name)),
      })),
      totalCounts: data.totalCount,
      totalPages: Math.ceil(data.totalCount / params.size),
    };
  };

  return useQuery({
    queryKey: ['useGetInfiniteUserList', params],
    queryFn: getUserList,
    enabled: currTab === 'user-list',
  });
};

/** 학생 목록 조회 */
export const useGetInfiniteTraineeList = (
  currTab: UserManagementTabType,
  params: UserManagementFilter,
) => {
  const getUserList = async () => {
    const offset = (params.page - 1) * params.size;

    const { data } = await axiosInstance.get<UserManagementDto.GetUserList>(
      `/admin/users/trainees`,
      { params: { ...params, offset } },
    );

    return {
      userList: data.content.map(user => ({
        ...user,
        campus: user.campus.sort((a, b) => a.name.localeCompare(b.name)),
        course: user.course.sort((a, b) => a.name.localeCompare(b.name)),
      })),
      totalCounts: data.totalCount,
      totalPages: Math.ceil(data.totalCount / params.size),
    };
  };

  return useQuery({
    queryKey: ['useGetInfiniteTraineeList', params],
    queryFn: getUserList,
    enabled: currTab === 'trainee-list',
  });
};

/** 사용자 정보 조회 */
export const useGetUserToManageInfo = ({ userId }: { userId: number }) => {
  const getUserToManage = async () => {
    const { data } = await axiosInstance.get<UserProfileDto.Get>(
      `/admin/users/${userId}`,
    );
    return {
      ...data,
      campusList: data.campusList.sort((a, b) =>
        a.campusName.localeCompare(b.campusName),
      ),
      courseList: data.courseList.sort((a, b) =>
        a.courseTitle.localeCompare(b.courseTitle),
      ),
      domainList: data.domainList.sort((a, b) => a.id - b.id),
      jobList: data.jobList.sort((a, b) => a.id - b.id),
      techStackList: data.techStackList.sort((a, b) => a.id - b.id),
    };
  };

  return useQuery({
    queryKey: ['useGetUserToManageInfo', userId],
    queryFn: getUserToManage,
  });
};

/** 학생에 대한 메모 조회 */
export const useGetTraineeMemo = ({ traineeId }: { traineeId: number }) => {
  const getTraineeMemo = async () => {
    const { data } = await axiosInstance.get<UserManagementDto.GetMemo>(
      `/admin/users/trainees/${traineeId}/memo`,
    );
    return data;
  };

  return useQuery({
    queryKey: ['useGetTraineeMemo', traineeId],
    queryFn: getTraineeMemo,
  });
};

/** 사용자 찜한 글 조회 */
export const useGetUserScrapList = (
  currCollection: UserCollection,
  params: PaginationFilter,
  userId?: number,
) => {
  const getUserScrapList = async () => {
    const { data } = await axiosInstance.get<UserManagementDto.GetScrapList>(
      `/admin/users/${userId}/scrap`,
      { params },
    );
    return data;
  };

  return useQuery({
    queryKey: ['useGetUserScrapList', userId, params],
    queryFn: getUserScrapList,
    enabled: currCollection === '찜한 글' && !!userId,
  });
};

/** 사용자 작성 글 조회 */
export const useGetUserPostList = (
  userId: number,
  params: UserManagementDto.GetPostListParams,
  currCollection: UserCollection,
) => {
  const postTypes =
    params.postTypes?.length !== 0
      ? { postTypes: params.postTypes?.join(',') }
      : {};

  const getUserPostList = async () => {
    const { data: postList } =
      await axiosInstance.get<UserManagementDto.GetPostList>(
        `/admin/users/${userId}/post`,
        { params: { ...params, postTypes } },
      );

    return {
      ...postList,
      content: postList.content.map(({ postType, ptype, ...rest }) => {
        return {
          ptype,
          ...rest,
          postType: postType === 'PROJECT' ? ptype : postType,
        };
      }),
    };
  };

  return useQuery({
    queryKey: ['useGetUserPostList', userId, params],
    queryFn: getUserPostList,
    enabled: currCollection === '게시글' && !!userId,
  });
};

/** 사용자 작성 댓글 조회 */
export const useGetUserCommentList = (
  userId: number,
  params: UserManagementDto.GetPostListParams,
  currCollection: UserCollection,
) => {
  const getUserCommentList = async () => {
    const { data } = await axiosInstance.get<UserManagementDto.GetCommentList>(
      `/admin/users/${userId}/comments`,
      { params: { ...params, postTypes: params.postTypes?.join(',') } },
    );

    return {
      ...data,
      content: data.content.map(
        ({ postType, ptype, ...rest }) =>
          ({
            ...rest,
            postType: postType === 'PROJECT' ? ptype : postType,
          }) as UserComment,
      ),
    };
  };

  return useQuery({
    queryKey: ['useGetUserCommentList', userId, params],
    queryFn: getUserCommentList,
    enabled: currCollection === '댓글' && !!userId,
  });
};

/** 사용자가 신청한 특강/행사 */
export const useGetUserAppliedSessionList = ({
  userId,
  type,
}: {
  userId: number;
  type?: 'allList' | 'nearList';
}) => {
  const getUserAppliedSessionList = async () => {
    const { data } = await axiosInstance.get<SessionDto.GetAppliedSessionList>(
      `/admin/users/${userId}/participantTitle`,
    );
    if (type === 'nearList') return data.nearList;
    return data.allList;
  };

  return useQuery({
    queryKey: ['useGetUserAppliedSessionList', userId, type],
    queryFn: getUserAppliedSessionList,
    enabled: !!userId,
  });
};
