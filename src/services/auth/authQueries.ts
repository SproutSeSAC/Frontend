import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import { axiosInstance } from '@/services/axiosInstance';

import { UserProfileDto } from '@/types';
import { AxiosResponse } from 'axios';

// 로그인 검증
export const loginCheck = () => axiosInstance.get('/login/check');

// 인증코드
export const getVerifyCodeResult = (code: string) =>
  axiosInstance.get(`/user/verification/${code}`);

// 닉네임 중복확인
export const getVerifyNicknameResult = (nickname: string) =>
  axiosInstance.get(`/user/nickname/duplicate`, {
    params: {
      nickname,
    },
  });

// 캘린더 인증
export const getCalendarToken = () => axiosInstance.get('/user/calendar');

// 리프레시 토큰
export const getNewAccessToken = () => axiosInstance.get('/login/refresh');

export const initialUserProfile: UserProfileDto.Get = {
  email: '',
  campusList: [],
  courseList: [
    {
      courseId: 0,
      courseTitle: '',
      courseStartDate: '',
      courseEndDate: '',
    },
  ],
  name: '',
  domainList: [],
  jobList: [],
  techStackList: [],
  nickname: '',
  profileImageUrl: '',
  role: 'TRAINEE',
};

// 나의 회원 정보 얻기
export const useGetUserProfile = (
  options?: UseQueryOptions<UserProfileDto.Get>,
) => {
  const getUserProfile = async () => {
    const res: AxiosResponse<UserProfileDto.Get> =
      await axiosInstance.get('/user/check');
    return res.data;
  };

  return useQuery<UserProfileDto.Get>({
    queryKey: ['useGetUserProfile'],
    queryFn: getUserProfile,
    initialData: initialUserProfile,
    ...options,
  });
};
