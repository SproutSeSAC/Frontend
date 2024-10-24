import { useMutation } from '@tanstack/react-query';

import { axiosInstance } from '../axiosInstance';

import { PostMeal, PutMealPost } from '@/types/store/storeMealPostDto';
import { AxiosError } from 'axios';

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
