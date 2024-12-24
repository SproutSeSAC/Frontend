import { useMutation } from '@tanstack/react-query';

import { axiosInstance } from '@/services/axiosInstance';

import { PostStoreReviewRequest } from '@/types/store/storeDto';
import { PostMeal, PutMealPost } from '@/types/store/storeMealPostDto';
import { AxiosError } from 'axios';

export const usePostStoreScrap = () => {
  return useMutation<boolean, AxiosError, { storeId: number }>({
    mutationFn: async requestParams => {
      const { data } = await axiosInstance.post(
        `/store/${requestParams.storeId}/scrap`,
      );
      return data;
    },
  });
};

export const usePostStoreReview = () => {
  return useMutation<boolean, AxiosError, PostStoreReviewRequest>({
    mutationFn: async requestParams => {
      const { data } = await axiosInstance.post(
        `/store/${requestParams.storeId}/review`,

        {
          rating: requestParams.rating,
          review: requestParams.review,
        },
      );
      return data;
    },
  });
};

export const usePostMeal = () => {
  return useMutation<boolean, AxiosError, PostMeal>({
    mutationFn: async requestBody => {
      const { data } = await axiosInstance.post(`/mealPost`, requestBody);
      return data;
    },
  });
};

export const usePutMealPost = () => {
  return useMutation<boolean, AxiosError, PutMealPost>({
    mutationFn: async requestBody => {
      const { data } = await axiosInstance.put(
        `/mealPost/participation`,
        requestBody,
      );
      return data;
    },
  });
};

export const usePutMealPostLeave = () => {
  return useMutation<boolean, AxiosError, PutMealPost>({
    mutationFn: async requestBody => {
      const { data } = await axiosInstance.put(`/mealPost/leave`, requestBody);
      return data;
    },
  });
};

export const usePutMealPostDelete = () => {
  return useMutation<boolean, AxiosError, PutMealPost>({
    mutationFn: async requestBody => {
      const { data } = await axiosInstance.delete(`/mealPost`, {
        data: requestBody,
      });
      return data;
    },
  });
};
