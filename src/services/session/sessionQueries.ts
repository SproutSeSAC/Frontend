import { useEffect, useState } from 'react';

import { axiosInstance } from '@/services/axiosInstance';

import { ParticipantDetail, ParticipantTitleData, Session } from '@/types';
import { AxiosResponse } from 'axios';

export const fetchParticipantTitle =
  async (): Promise<ParticipantTitleData> => {
    const res: AxiosResponse<ParticipantTitleData> = await axiosInstance.get(
      '/mypage/getParticipantTitle',
    );
    return res.data;
  };

export const fetchParticipantDetail = async (): Promise<
  ParticipantDetail[]
> => {
  const res: AxiosResponse<ParticipantDetail[]> = await axiosInstance.get(
    '/mypage/getParticipant',
  );
  return res.data;
};

export const fetchParticipants = async (sessionId: number) => {
  try {
    const response = await axiosInstance.get(`/notices/sessions/${sessionId}`);

    // 데이터 유효성 검사 및 안전한 매핑
    if (!response.data || !response.data.content) {
      throw new Error("Invalid response structure");
    }

    return response.data.content.map(
      (item: {
        noticeParticipantId: number;
        userId: number;
        userName: string;
        nickName: string;
        phoneNumber: string;
        email: string;
        profileImageUrl: string;
        status: "WAIT" | "PARTICIPANT" | "REJECT";
        campuses?: { id: number; name: string }[];
        courses?: { id: number; name: string }[];
      }) => ({
        id: item.noticeParticipantId,
        userId: item.userId,
        name: item.userName,
        nickName: item.nickName,
        phoneNumber: item.phoneNumber || "정보 없음",
        email: item.email || "정보 없음",
        profileImageUrl: item.profileImageUrl || "",
        status: item.status,
        campuses: item.campuses || [],
        courses: item.courses || [],
      })
    );
  } catch (error) {
    console.error("Error fetching participants:", error);
    return [];
  }
};


export const useFetchSessionsByType = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = async ({
    page = 1,
    size = 10,
    types = ['SPECIAL_LECTURE', 'EVENT'],
  }: {
    page?: number;
    size?: number;
    types?: string[];
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const urls = types.map(
        type => `/notices?page=${page}&size=${size}&noticeType=${type}`,
      );

      const noticeResponses = await Promise.all(
        urls.map(url => axiosInstance.get(url)),
      );

      const noticeIds = noticeResponses.flatMap(response =>
        response.data.notices.map(
          (notice: { noticeId: number }) => notice.noticeId,
        ),
      );

      const detailRequests = noticeIds.map(id =>
        axiosInstance.get(`/notices/${id}`),
      );
      const detailResponses = await Promise.allSettled(detailRequests);

      const successfulResponses = detailResponses
        .filter(result => result.status === 'fulfilled')
        .map(result => (result as PromiseFulfilledResult<AxiosResponse>).value.data);

      const combinedSessions: Session[] = successfulResponses.sort(
        (a, b) =>
          new Date(b.applicationStartDateTime).getTime() -
          new Date(a.applicationStartDateTime).getTime(),
      );

      setSessions(combinedSessions);
    } catch (err) {
      setError('세션 정보를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions({}).catch(() =>
      setError('세션 정보를 불러오는 중 오류가 발생했습니다.'),
    );
  }, []);

  return { sessions, isLoading, fetchSessions, error };
};


export const fetchParticipantDetailWithNotice = async (): Promise<Session[]> => {
  const participantDetails: ParticipantDetail[] = await fetchParticipantDetail();

  const noticeRequests = participantDetails.map(participant =>
    axiosInstance.get(`/notices/${participant.id}`),
  );

  const noticeResponses = await Promise.all(noticeRequests);
  return noticeResponses.map(res => res.data);
};