import { useSearchParams } from 'react-router-dom';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { axiosInstance } from '@/services/axiosInstance';

import {
  GetNoticeCommentResponse,
  GetNoticeDetailResponse,
  GetNoticeListResponse,
  NoticeFilter,
  Role,
} from '@/types';

import { NoticeCategoryKeySchemaType } from '@/components/notice/form/NoticeFormSchema';

export const extractValidParams = (searchParams: URLSearchParams) => {
  return Object.fromEntries(
    Array.from(searchParams.entries()).filter(([, value]) =>
      ['CAMPUS_MANAGER', 'EDU_MANAGER', 'JOB_COORDINATOR', 'BOOKMARK'].includes(
        value,
      ),
    ),
  );
};

interface Params {
  onlyScraped?: string | undefined;
  page: number;
  size: number;
  noticeType?: NoticeCategoryKeySchemaType;
  roleType?: Role;
  keyword?: string;
}
export const useGetInfiniteNoticeList = (params: NoticeFilter) => {
  const [searchParams] = useSearchParams();

  const validParams = extractValidParams(searchParams);

  const mergedParams: Params = {
    ...params,
    ...validParams,
    ...(validParams.roleType === 'BOOKMARK' && { onlyScraped: 'true' }),
  };

  if (mergedParams.noticeType === 'ALL') {
    delete mergedParams.noticeType;
  }

  if (validParams.roleType && validParams.roleType === 'BOOKMARK') {
    mergedParams.onlyScraped = 'true';
    delete mergedParams.roleType;
  }

  const pageSize = 10;
  return useInfiniteQuery({
    queryKey: ['useGetInfiniteNoticeList', mergedParams],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await axiosInstance.get<GetNoticeListResponse>(
        `/notices`,
        {
          params: mergedParams,
        },
      );
      return {
        notices: data.notices,
        nextPage: data.notices.length === pageSize ? pageParam + 1 : undefined,
      };
    },
    getNextPageParam: lastPage => lastPage.nextPage,
    initialPageParam: 1,
  });
};

export const useGetNoticeDetail = (noticeId: number) => {
  return useQuery({
    queryKey: ['useGetNoticeDetail'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<GetNoticeDetailResponse>(
        `/notices/${noticeId}`,
      );
      return data;
    },
  });
};

export const useGetNoticeCommentList = (noticeId: number) => {
  return useQuery({
    queryKey: ['useGetNoticeCommentList'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<GetNoticeCommentResponse>(
        `/notices/${noticeId}/comments`,
      );
      return data;
    },
  });
};
