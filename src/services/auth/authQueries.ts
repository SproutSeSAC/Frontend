import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import { axiosInstance } from '@/services/axiosInstance';

import { UserProfile } from '@/types';
import { AxiosResponse } from 'axios';

// 로그인 검증
export const loginCheck = () => axiosInstance.get('/login/check');

// 캘린더 인증
export const getCalendarToken = () => axiosInstance.get('/user/calendar');

// 리프레시 토큰
export const getNewAccessToken = () => axiosInstance.get('/login/refresh');

// 나의 회원 정보 얻기
export const useGetUserProfile = (options?: UseQueryOptions<UserProfile>) => {
  const getUserProfile = async () => {
    const res: AxiosResponse<UserProfile> =
      await axiosInstance.get('/user/check');
    return res.data;
  };

  return useQuery<UserProfile>({
    queryKey: ['useGetUserProfile'],
    queryFn: getUserProfile,
    initialData: {
      email: '',
      campusName: '',
      courseTitle: '',
      courseStartDate: '',
      courseEndDate: '',
      name: '',
      domainList: [],
      jobList: [],
      techStackList: [],
      nickname: '',
      profileImageUrl: '',
      role: 'TRAINEE',
    } as UserProfile,
    ...options,
  });
};
