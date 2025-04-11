import { useQuery } from '@tanstack/react-query';

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
