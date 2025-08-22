import { UseQueryOptions, useQueries, useQuery } from '@tanstack/react-query';

import { axiosInstance } from '@/services/axiosInstance';

export type CourseListData = {
  courseList: {
    id: number;
    title: string;
    campusName: string;
    campusId?: number;
  }[];
};

export type CampusListData = {
  campusList: {
    id: number;
    name: string;
    longitude: string;
    latitude: string;
    naverPlaceId: number;
  }[];
};

export const useGetCourseList = (
  campusId?: number,
  options?: UseQueryOptions<CourseListData['courseList']>,
) => {
  const getCourseList = async () => {
    const res = await axiosInstance.get<CourseListData>(
      `/course/list/${campusId}`,
    );
    return res.data.courseList;
  };

  return useQuery<CourseListData['courseList']>({
    queryKey: ['courseList', campusId],
    queryFn: getCourseList,
    enabled: !!campusId,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useGetCourseListByCampus = (
  campusIds: number[],
  options?: UseQueryOptions<CourseListData['courseList']>,
) => {
  const getCourseList = async (campusId: number) => {
    const res = await axiosInstance.get<CourseListData>(
      `/course/list/${campusId}`,
    );
    return res.data.courseList
      .map(course => ({ ...course, campusId }))
      .sort((a, b) => a.title.localeCompare(b.title));
  };

  return useQueries({
    queries: campusIds.map(campusId => {
      return {
        queryKey: ['courseListByCampus', campusId],
        queryFn: () => getCourseList(campusId),
        enabled: !!campusId,
        ...options,
      };
    }),
  });
};

export const useGetCampusList = (
  options?: UseQueryOptions<CampusListData['campusList']>,
) => {
  const getCampusList = async () => {
    const res = await axiosInstance.get<CampusListData>('/campus/list');
    return res.data.campusList.sort((a, b) => a.name.localeCompare(b.name));
  };

  return useQuery<CampusListData['campusList']>({
    queryKey: ['useGetCampusList'],
    queryFn: getCampusList,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    ...options,
  });
};
