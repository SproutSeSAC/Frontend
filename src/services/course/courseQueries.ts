import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import { axiosInstance } from '@/services/axiosInstance';

import { AxiosResponse } from 'axios';

type CourseListData = {
  courseList: {
    id: number;
    title: string;
    campusName: string;
  }[];
};

type CampusListData = {
  campusList: {
    id: number;
    name: string;
  }[];
};

export const useGetCourseList = (
  campusId?: number,
  options?: UseQueryOptions<CourseListData['courseList']>,
) => {
  const getCourseList = async () => {
    const res: AxiosResponse<CourseListData> = await axiosInstance.get(
      `/course/list/${campusId}`,
    );
    return res.data.courseList;
  };

  return useQuery<CourseListData['courseList']>({
    queryKey: ['courseList', campusId],
    queryFn: getCourseList,
    enabled: !!campusId,
    ...options,
  });
};

export const useGetCampusList = (
  options?: UseQueryOptions<CampusListData['campusList']>,
) => {
  const getCampusList = async () => {
    const res: AxiosResponse<CampusListData> =
      await axiosInstance.get('/campus/list');
    return res.data.campusList;
  };

  return useQuery<CampusListData['campusList']>({
    queryKey: ['campusList'],
    queryFn: getCampusList,
    ...options,
  });
};
