import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { axiosInstance } from '../axiosInstance';

import { FilterType } from '@/types';
import { StoreDto } from '@/types/store/storeDto';

export const useGetInfiniteStoreList = (
  params: StoreDto.Request.GetStoreList,
) => {
  return useInfiniteQuery({
    queryKey: ['useGetInfiniteStoreList', params],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await axiosInstance.get(`/store/list`, {
        params: {
          ...params,
          page: pageParam,
          isZeropay: false,
          underPrice: false,
          overFivePerson: false,
          walkTimeWithinFiveMinutes: false,
        },
      });
      return data;
    },
    getNextPageParam: (data, pages) => {
      if (data.totalPages === 0 || data.totalPages === pages.length)
        return undefined;
      return pages.length;
    },
    initialPageParam: 1,
  });
};

export const useGetCampusList = () => {
  return useQuery({
    queryKey: ['useGetCampusList'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<FilterType[]>('/campus/list');
      return data;
    },
  });
};
