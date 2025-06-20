import { useSearchParams } from 'react-router-dom';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { axiosInstance } from '@/services/axiosInstance';

import { AppliedSessionStatusKey, PaginationFilter, SessionDto } from '@/types';

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
  filterParams: PaginationFilter;
}) => {
  const [searchParams] = useSearchParams();
  const tabName = searchParams.get('tab');

  const params = {
    ...filterParams,
    applicationStatus: tabName === 'ALL' ? undefined : tabName,
  };

  return useInfiniteQuery({
    queryKey: ['useGetNoticeSessionList', params],
    queryFn: async ({ pageParam = 0 }) => {
      const { data } = await axiosInstance.get<SessionDto.GetNoticeSessionList>(
        `/notices/sessions`,
        {
          params: {
            ...params,
            offset: pageParam * filterParams.size,
            page: pageParam,
          },
        },
      );

      return {
        noticeSessionList: data.noticeSession,
        currentPage: pageParam,
        offset: pageParam * filterParams.size,
        nextPage: !data?.isLastPage ? pageParam + 1 : undefined,
      };
    },
    getNextPageParam: lastPage => lastPage.nextPage,
    initialPageParam: 0,
  });
};

export const useGetSessionApplicantList = (params: {
  sessionId: number;
  page: number;
  size: number;
  searchParticipantStatus?: AppliedSessionStatusKey;
}) => {
  const getSessionApplicantList = async () => {
    const { data } =
      await axiosInstance.get<SessionDto.GetSessionApplicantList>(
        `/notices/sessions/${params.sessionId}`,
        {
          params: { ...params, page: params.page - 1 },
        },
      );
    return {
      ...data,
      content: data.content.map(item => ({
        ...item,
        courses: item.courses.sort((a, b) => a.name.localeCompare(b.name)),
        campuses: item.campuses.sort((a, b) => a.name.localeCompare(b.name)),
      })),
    };
  };
  return useQuery<SessionDto.GetSessionApplicantList>({
    queryKey: ['useGetSessionApplicantList', params],
    queryFn: getSessionApplicantList,
    enabled: !!Number(params.sessionId),
  });
};
