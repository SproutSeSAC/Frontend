import { useSearchParams } from 'react-router-dom';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { axiosInstance } from '@/services/axiosInstance';

import { SessionStatus } from '@/constants/serviceConstant';
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

      const hasNextPage = !data.isLastPage;

      const nextPage = hasNextPage ? pageParam + 1 : undefined;

      return {
        notices: data.notices,
        currentPage: pageParam,
        offset: (pageParam - 1) * filterParams.size,
        nextPage,
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
      .slice(0, 3);

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

export const useGetSessionStatus = ({
  sessionId,
  page = 1,
  size = 10,
  searchParticipantStatus = 'WAIT',
}: {
  sessionId: number;
  page?: number;
  size?: number;
  searchParticipantStatus?: SessionStatus;
}) => {
  const getSessionStatus = async () => {
    const { data } = await axiosInstance.get(`/notices/sessions/${sessionId}`, {
      params: {
        sessionId,
        page,
        size,
        searchParticipantStatus,
      },
    });
    return data;
  };
  return useQuery({
    queryKey: ['useGetSessionStatus', sessionId],
    queryFn: getSessionStatus,
    enabled: !!Number(sessionId),
    retry: false,
  });
};
