import { useSearchParams } from 'react-router-dom';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { axiosInstance } from '@/services/axiosInstance';

import {
  GetFilterCountResponse,
  GetStoreDetailResponse,
  GetStoreListResponse,
} from '@/types/store/storeDto';
import {
  GetMealPostDetail,
  GetMealPostList,
} from '@/types/store/storeMealPostDto';
import { extractValidParams } from '@/utils';

export const useGetInfiniteStoreList = (campusId: number) => {
  const [searchParams] = useSearchParams();
  const newSearchParams = extractValidParams(searchParams);
  const pageSize = 10;

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
            size: pageSize,
          },
        },
      );
      return {
        stores: data.stores,
        nextPage: data.stores.length === pageSize ? pageParam + 1 : undefined,
      };
    },
    getNextPageParam: lastPage => lastPage.nextPage,
    initialPageParam: 1,
    enabled: !!campusId,
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
    queryFn: async ({ pageParam = 0 }) => {
      const { data } = await axiosInstance.get<GetMealPostList>(`/mealPost`, {
        params: {
          page: pageParam,
          size: 5,
          sort: [],
        },
      });

      const hasNextPage = data.mealPosts.length !== 0;
      const nextPage = hasNextPage ? pageParam + 1 : null;

      return {
        mealPostList: data.mealPosts,
        currentPage: pageParam,
        nextPage,
      };
    },
    getNextPageParam: lastPage => lastPage.nextPage,
    initialPageParam: 0,
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
