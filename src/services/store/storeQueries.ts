import { useSearchParams } from 'react-router-dom';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { axiosInstance } from '../axiosInstance';

import { FilterType } from '@/types';
import {
  GetFilterCountResponse,
  GetStoreDetailResponse,
  GetStoreListResponse,
} from '@/types/store/storeDto';
import {
  GetMealPostDetail,
  GetMealPostList,
} from '@/types/store/storeMealPostDto';

export const extractValidParams = (searchParams: URLSearchParams) => {
  return Object.fromEntries(
    Array.from(searchParams.entries()).map(([key, value]) => {
      return [key, value];
    }),
  );
};

export const useGetInfiniteStoreList = (campusId: number) => {
  const [searchParams] = useSearchParams();
  const newSearchParams = extractValidParams(searchParams);

  return useInfiniteQuery({
    queryKey: ['useGetInfiniteStoreList', newSearchParams],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await axiosInstance.get<GetStoreListResponse>(
        `/store/list`,
        {
          params: {
            page: pageParam,
            campusId: newSearchParams.campusId || campusId,
            ...newSearchParams,
          },
        },
      );
      return data;
    },
    getNextPageParam: (data, pages) => {
      if (data.totalPages === 0 || data.totalPages === pages.length)
        return undefined;
      return pages.length;
    },
    initialPageParam: 1,
    enabled: !!campusId,
  });
};

export const useGetCampusList = () => {
  return useQuery({
    queryKey: ['useGetCampusList'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<{ campusList: FilterType[] }>(
        '/campus/list',
      );
      return data;
    },
  });
};

export const useGetFilterCount = (campusId: number) => {
  return useQuery({
    queryKey: ['useGetFilterCount'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<GetFilterCountResponse>(
        '/store/filterCount',
        { params: { campusId } },
      );
      return data;
    },
    enabled: !!campusId,
  });
};

export const useGetStoreDetail = (storeId: number) => {
  return useQuery({
    queryKey: ['useGetStoreDetail'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<GetStoreDetailResponse>(
        `/store/${storeId}`,
      );
      return data;
    },
  });
};

export const useGetInfiniteMealPostList = () => {
  return useInfiniteQuery({
    queryKey: ['useGetInfiniteMealPostList'],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await axiosInstance.get<GetMealPostList>(
        `/mealPost/list`,
        {
          params: {
            page: pageParam,
            size: 10,
            sort: [],
          },
        },
      );
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

export const useGetMealPostDetail = (mealPostId: number) => {
  return useQuery({
    queryKey: ['useGetMealPostDetail'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<GetMealPostDetail>(
        `/mealPost/${mealPostId}`,
      );
      return data;
    },
    enabled: !!mealPostId,
  });
};
