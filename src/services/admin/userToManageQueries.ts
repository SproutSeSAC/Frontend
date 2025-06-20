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

export type UserManagementFilter = PaginationFilter & {
  offset?: number;
  campusId?: number;
  courseId?: number;
  keyword?: string;
  roles?: RoleKey[];
};

const getUserList = async (params: UserManagementFilter, url: string) => {
  const { keyword, page, ...rest } = params;

  const { data } = await axiosInstance.get<UserManagementDto.GetUserList>(url, {
    params: {
      ...rest,
      ...(keyword !== '' ? { keyword } : {}),
      page: page - 1,
    },
  });

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

/** 사용자 목록 조회 */
export const useGetInfiniteUserList = (
  currTab: UserManagementTabType,
  params: UserManagementFilter,
) => {
  return useQuery({
    queryKey: ['useGetInfiniteUserList', params],
    queryFn: () => getUserList(params, `/admin/users`),
    enabled: currTab === 'user-list',
  });
};

/** 학생 목록 조회 */
export const useGetInfiniteTraineeList = (
  currTab: UserManagementTabType,
  params: UserManagementFilter,
) => {
  return useQuery({
    queryKey: ['useGetInfiniteTraineeList', params],
    queryFn: () => getUserList(params, `/admin/users/trainees`),
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
      { params: { ...params, page: params.page - 1 } },
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
    params.postTypes && params.postTypes?.length !== 0
      ? params.postTypes?.join(',')
      : 'NOTICE,PROJECT,STUDY,MEAL';

  const getUserPostList = async () => {
    const { data: postList } =
      await axiosInstance.get<UserManagementDto.GetPostList>(
        `/admin/users/${userId}/post`,
        { params: { ...params, page: params.page - 1, postTypes } },
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
      {
        params: {
          ...params,
          page: params.page - 1,
          postTypes: params.postTypes?.join(','),
        },
      },
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
