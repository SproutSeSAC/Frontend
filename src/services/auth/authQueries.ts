import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import { axiosInstance } from '@/services/axiosInstance';

import { UserProfileDto } from '@/types';

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
export const getNewAccessToken = () =>
  axiosInstance.get('/login/refresh').catch(() => {
    window.location.href = `${window.location.origin}/login`;
  });

export const initialUserProfile: UserProfileDto.Get = {
  userId: 0,
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
  role: 'TRAINEE',
  profileImageUrl: '',
  phoneNumber: '',
};

// 나의 회원 정보 얻기
export const useGetUserProfile = (
  options?: UseQueryOptions<UserProfileDto.Get>,
) => {
  const getUserProfile = async () => {
    const res = await axiosInstance.get<UserProfileDto.Get>('/user/check');

    const courseList = res.data.courseList.sort((a, b) =>
      a.courseTitle.localeCompare(b.courseTitle),
    );
    return { ...res.data, courseList };
  };

  return useQuery<UserProfileDto.Get>({
    queryKey: ['useGetUserProfile'],
    queryFn: getUserProfile,
    staleTime: 1000 * 60 * 5,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const initialUserProfileCard = {
  profile: {
    name: '',
    nickname: '',
    phoneNumber: null,
    profileUrl: '',
  },
  study: {
    email: '',
    campus: [],
    course: [],
  },
};

// 나의 카드 정보 얻기
export const useGetUserProfileCard = (
  options?: UseQueryOptions<UserProfileDto.GetCard>,
) => {
  const getUserProfileCard = async () => {
    const res =
      await axiosInstance.get<UserProfileDto.GetCard>('/mypage/getCard');
    return res.data;
  };

  return useQuery<UserProfileDto.GetCard>({
    queryKey: ['useGetUserProfileCard'],
    queryFn: getUserProfileCard,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    ...options,
  });
};
