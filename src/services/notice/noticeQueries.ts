import { useSearchParams } from 'react-router-dom';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { axiosInstance } from '@/services/axiosInstance';

import { NoticeDto, NoticeFilter } from '@/types';
import { isInThisWeek } from '@/utils';
import { AxiosResponse } from 'axios';

import { NOTICE_SEARCH_PARAMS } from '@/pages/Notice';

export const useGetInfiniteNoticeList = (filterParams: NoticeFilter) => {
  const [searchParams] = useSearchParams();
  const tabName = searchParams.get(NOTICE_SEARCH_PARAMS);

  const { noticeType: noticeTypeKey, ...restFilter } = filterParams;

  const isAllTab = tabName === 'ALL' || tabName === null;
  const isBookmarkTab = tabName === 'BOOKMARK';
  const isEditTab = tabName === 'EDIT';
  const isAllCategory = noticeTypeKey === 'ALL';

  const roleType =
    isAllTab || isBookmarkTab || isEditTab ? {} : { roleType: tabName };
  const noticeType = isAllCategory ? {} : { noticeType: noticeTypeKey };
  const onlyScraped = isBookmarkTab ? { onlyScraped: true } : {};

  const noticeFilerParams = {
    ...restFilter,
    ...roleType,
    ...onlyScraped,
    ...noticeType,
  };

  return useInfiniteQuery({
    queryKey: ['useGetInfiniteNoticeList', noticeFilerParams],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await axiosInstance.get<NoticeDto.GetNoticeList>(
        `/notices`,
        {
          params: {
            ...noticeFilerParams,
            offset: (pageParam - 1) * filterParams.size,
            page: pageParam,
          },
        },
      );

      const nextPage =
        data.notices.length === filterParams.size ? pageParam + 1 : pageParam;

      return {
        notices: data.notices,
        currentPage: pageParam,
        offset: (pageParam - 1) * filterParams.size,
        nextPage: pageParam < 2 ? nextPage : undefined, // NOTE: 이 부분 totalCount 속성 서버 변경 요청 예정
      };
    },
    getNextPageParam: lastPage => lastPage.nextPage,
    initialPageParam: 1,
  });
};

export const useGetThisWeekNoticeList = () => {
  const getThisWeekNotice = async () => {
    const { data } = await axiosInstance.get<NoticeDto.GetNoticeList>(
      `/notices`,
      { params: { page: 1, size: 20 } },
    );
    const thisWeekNotice = data.notices
      .filter(({ createdDateTime }) => isInThisWeek(createdDateTime))
      .slice(0, 6);
    return thisWeekNotice;
  };

  return useQuery({
    queryKey: ['useGetThisWeekNoticeList'],
    queryFn: getThisWeekNotice,
    retry: false,
  });
};

export const useGetNoticeDetail = (noticeId: number) => {
  return useQuery({
    queryKey: ['useGetNoticeDetail', noticeId],
    queryFn: async () => {
      const { data } = await axiosInstance.get<NoticeDto.GetNoticeDetail>(
        `/notices/${noticeId}`,
      );
      return data;
    },
  });
};

export const useGetNoticeCommentList = (noticeId: number) => {
  const getComment = async () => {
    const { data }: AxiosResponse<NoticeDto.GetNoticeComment> =
      await axiosInstance.get(`/notices/${noticeId}/comments`);
    return data?.comments;
  };
  return useQuery({
    queryKey: ['useGetNoticeCommentList', noticeId],
    queryFn: getComment,
  });
};
