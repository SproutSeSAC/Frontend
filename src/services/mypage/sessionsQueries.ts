import { useQuery } from '@tanstack/react-query';

import { axiosInstance } from '@/services/axiosInstance';

import { AxiosResponse } from 'axios';

interface Participant {
  postParticipantid: number;
  userId: number;
}

// 나의 세션 참가신청글
export const useGetMyParticipationList = () => {
  const getMyParticipationList = async () => {
    const { data }: AxiosResponse<Participant[]> = await axiosInstance.get(
      `/mypage/getParticipant`,
    );
    return data;
  };
  return useQuery({
    queryKey: ['useGetMyParticipationList'],
    queryFn: getMyParticipationList,
  });
};

export const useGetMyPostList = () => {
  const getMyPostList = async () => {
    const { data } = await axiosInstance.get(`/mypage/getPost`);
    return data;
  };
  return useQuery({
    queryKey: ['useGetMyPostList'],
    queryFn: getMyPostList,
  });
};
