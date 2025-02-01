import { useQuery } from '@tanstack/react-query';

import { axiosInstance } from '@/services/axiosInstance';

import { myPostDto } from '@/types/mypage/myPostDto';

export const useGetMyPostList = () => {
  const getMyPostList = async () => {
    const { data } =
      await axiosInstance.get<myPostDto.GetMyPostList>(`/mypage/getPost`);
    return data;
  };
  return useQuery({
    queryKey: ['useGetMyPostList'],
    queryFn: getMyPostList,
  });
};

export const useGetMyScrapedPostList = () => {
  const getMyScrapedPostList = async () => {
    const { data } =
      await axiosInstance.get<myPostDto.GetMyScrapedPostList>(
        `/mypage/getScrap`,
      );
    return data;
  };
  return useQuery({
    queryKey: ['useGetMyScrapedPostList'],
    queryFn: getMyScrapedPostList,
  });
};

export const useGetMyCommentList = () => {
  const getMyScrapedPostList = async () => {
    const { data } =
      await axiosInstance.get<myPostDto.GetMyCommentList>(
        `/mypage/getComments`,
      );
    return data;
  };
  return useQuery({
    queryKey: ['useGetMyScrapedPostList'],
    queryFn: getMyScrapedPostList,
  });
};
