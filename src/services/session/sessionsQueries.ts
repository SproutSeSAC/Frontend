import { useQuery } from '@tanstack/react-query';

import { axiosInstance } from '@/services/axiosInstance';

import { SessionStatus } from '@/constants/serviceConstant';

interface Participant {
  postParticipantid: number;
  userId: number;
}

// 나의 세션 참가신청글
export const useGetMyParticipationList = () => {
  const getMyParticipationList = async () => {
    const { data } = await axiosInstance.get<Participant[]>(
      `/mypage/getParticipant`,
    );
    return data;
  };
  return useQuery({
    queryKey: ['useGetMyParticipationList'],
    queryFn: getMyParticipationList,
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
  });
};
