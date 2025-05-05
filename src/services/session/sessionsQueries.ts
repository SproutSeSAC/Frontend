import { useSearchParams } from 'react-router-dom';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { axiosInstance } from '@/services/axiosInstance';

import { AppliedSessionStatusKey, SessionDto } from '@/types';

/** TRAINEE API */
export const useGetAppliedSessionList = (type = 'allList') => {
  const getMyParticipationList = async () => {
    const { data } = await axiosInstance.get<SessionDto.GetAppliedSessionList>(
      `/mypage/getParticipant`,
    );
    if (type === 'nearList') return data.nearList;
    return data.allList;
  };
  return useQuery({
    queryKey: ['useGetAppliedSessionList', type],
    queryFn: getMyParticipationList,
  });
};

/** ADMIN API */
export const useGetNoticeSessionList = ({
  filterParams,
}: {
  filterParams: {
    page: number;
    size: number;
  };
}) => {
  const [searchParams] = useSearchParams();
  const tabName = searchParams.get('tab');

  const params = {
    ...filterParams,
    applicationStatus: tabName === 'ALL' ? undefined : tabName,
  };

  return useInfiniteQuery({
    queryKey: ['useGetNoticeSessionList', params],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await axiosInstance.get<SessionDto.GetNoticeSessionList>(
        `/notices/sessions`,
        {
          params: {
            ...params,
            offset: (pageParam - 1) * filterParams.size,
            page: pageParam,
          },
        },
      );

      const hasNextPage = false; //! data?.isLastPage

      const nextPage = hasNextPage ? pageParam + 1 : undefined;

      return {
        noticeSessionList: data,
        currentPage: pageParam,
        offset: (pageParam - 1) * filterParams.size,
        nextPage,
      };
    },
    getNextPageParam: lastPage => lastPage.nextPage,
    initialPageParam: 1,
  });
};

export const useGetSessionApplicantList = ({
  sessionId,
  page = 1,
  size = 10,
  searchParticipantStatus,
}: {
  sessionId: number;
  page?: number;
  size?: number;
  searchParticipantStatus?: AppliedSessionStatusKey;
}) => {
  const getSessionApplicantList = async () => {
    const { data } =
      await axiosInstance.get<SessionDto.GetSessionApplicantList>(
        `/notices/sessions/${sessionId}`,
        {
          params: {
            sessionId,
            page,
            size,
            searchParticipantStatus,
          },
        },
      );
    return data;
  };
  return useQuery<SessionDto.GetSessionApplicantList>({
    queryKey: [
      'useGetSessionApplicantList',
      sessionId,
      searchParticipantStatus,
    ],
    queryFn: getSessionApplicantList,
    enabled: !!Number(sessionId),
  });
};
