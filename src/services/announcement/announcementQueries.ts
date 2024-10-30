import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import { axiosInstance } from '@/services/axiosInstance';

import { AxiosResponse } from 'axios';

export const useGetAnnouncementList = (options?: UseQueryOptions) => {
  const getAnnouncementList = async () => {
    const params = {
      noticeType: 'GENERAL',
      page: 1,
      size: 20,
      sort: 'latest',
    };

    const response: AxiosResponse = await axiosInstance.get('/notices', {
      params,
    });
    return response;
  };

  return useQuery({
    queryKey: ['announcement'],
    queryFn: getAnnouncementList,
    initialData: [],
    ...options,
  });
};
