import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import { axiosInstance } from '@/services/axiosInstance';

import { CALENDAR_TOKEN_KEY } from '@/constants';
import { UserProfileDto } from '@/types';

// 로그인 검증
export const loginCheck = () => axiosInstance.get('/login/check');

// 인증코드
export const getVerifyCodeResult = (code: string) =>
  axiosInstance.get(`/user/verification/${code}`);

// 닉네임 중복확인
export const getVerifyNicknameResult = (nickname: string) =>
  axiosInstance.get(`/user/nickname/duplicate`, {
    params: { nickname },
  });

// 캘린더 인증
export const getCalendarToken = () =>
  axiosInstance.get('/user/calendar').then(res => {
    const calendarAccessToken = res.data.access_token;
    if (calendarAccessToken) {
      sessionStorage.setItem(CALENDAR_TOKEN_KEY, calendarAccessToken);
    }
  });

// 리프레시 토큰
export const getNewAccessToken = () =>
  axiosInstance.get('/login/refresh').catch(error => {
    console.log('리프레시 error:', error);
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

    const campusList = res.data.campusList.sort((a, b) =>
      a.campusName.localeCompare(b.campusName),
    );

    const courseList = res.data.courseList.sort((a, b) =>
      a.courseTitle.localeCompare(b.courseTitle),
    );

    const domainList = res.data.domainList?.sort((a, b) => a.id - b.id);
    const techStackList = res.data.techStackList?.sort((a, b) => a.id - b.id);
    const jobList = res.data.jobList?.sort((a, b) => a.id - b.id);

    return {
      ...res.data,
      courseList,
      campusList,
      domainList,
      techStackList,
      jobList,
    };
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

    const campusList = res.data.study.campus.sort((a, b) =>
      a.campusName.localeCompare(b.campusName),
    );
    const courseList = res.data.study.course.sort((a, b) =>
      a.courseName.localeCompare(b.courseName),
    );
    return {
      ...res.data,
      study: { ...res.data.study, campus: campusList, course: courseList },
    };
  };

  return useQuery<UserProfileDto.GetCard>({
    queryKey: ['useGetUserProfileCard'],
    queryFn: getUserProfileCard,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    ...options,
  });
};
