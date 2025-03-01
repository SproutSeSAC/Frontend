import { useQuery } from '@tanstack/react-query';

import { axiosInstance } from '@/services/axiosInstance';

import { Collection } from '@/types';
import { myPostDto } from '@/types/mypage/myPostDto';

export const useGetMyPostList = (collection: Collection) => {
  const getMyPostList = async () => {
    const { data } =
      await axiosInstance.get<myPostDto.GetMyPostList>(`/mypage/getPost`);
    return data;
  };
  return useQuery({
    queryKey: ['useGetMyPostList'],
    queryFn: getMyPostList,
    enabled: collection === '내가 쓴 게시글',
  });
};

export const useGetMyScrapedPostList = (collection: Collection) => {
  const getMyScrapedPostList = async () => {
    const { data } = await axiosInstance.get<myPostDto.GetMyScrapedPostList>(
      `/mypage/getScrap`,
      {
        params: {
          page: 0,
          size: 20,
        },
      },
    );
    return data;
  };
  return useQuery({
    queryKey: ['useGetMyScrapedPostList'],
    queryFn: getMyScrapedPostList,
    enabled: collection === '내가 찜한 글',
  });
};

export const useGetMyCommentList = (collection: Collection) => {
  const getMyScrapedPostList = async () => {
    const { data } =
      await axiosInstance.get<myPostDto.GetMyCommentList>(
        `/mypage/getComments`,
      );
    return data.map(({ userNickname, content, ...rest }) => ({
      ...rest,
      title: content,
      createdNickName: userNickname,
      ptype: 'NOTICE' as const,
      linkedId: rest.postId,
      postId: rest.commentId,
    }));
  };
  return useQuery({
    queryKey: ['useGetMyCommentList'],
    queryFn: getMyScrapedPostList,
    enabled: collection === '내가 쓴 댓글',
  });
};
