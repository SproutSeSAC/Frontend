import { useQuery } from '@tanstack/react-query';

import { axiosInstance } from '@/services/axiosInstance';

export const useGetMyPostList = () => {
  const getMyPostList = async () => {
    const { data } = await axiosInstance.get(`/mypage/getPost`);
    return data;
  };
  return useQuery({
    queryKey: ['useGetMyPostList'],
    queryFn: getMyPostList,
  });
};

export const useGetMyScrapedPostList = () => {
  const getMyScrapedPostList = async () => {
    const { data } = await axiosInstance.get(`/mypage/getScrap`);
    return data;
  };
  return useQuery({
    queryKey: ['useGetMyScrapedPostList'],
    queryFn: getMyScrapedPostList,
  });
};
