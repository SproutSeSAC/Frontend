import { useQuery } from '@tanstack/react-query';

import { axiosInstance } from '@/services/axiosInstance';

import { MyCollection } from '@/types';
import { MyPostDto, UserComment } from '@/types/mypage/myPostDto';

export const useGetMyPostList = (collection: MyCollection) => {
  const getMyPostList = async () => {
    const { data } =
      await axiosInstance.get<MyPostDto.GetPostList>(`/mypage/getPost`);
    return data;
  };
  return useQuery({
    queryKey: ['useGetMyPostList'],
    queryFn: getMyPostList,
    enabled: collection === '내가 쓴 게시글',
  });
};

export const useGetMyScrapedPostList = (collection: MyCollection) => {
  const getMyScrapedPostList = async () => {
    const { data: postList } =
      await axiosInstance.get<MyPostDto.GetScrapedPostList>(
        `/mypage/getScrap`,
        {
          params: {
            page: 0,
            size: 20,
          },
        },
      );
    return {
      ...postList,
      content: postList.content.map(({ postType, ptype, ...rest }) => {
        return {
          ...rest,
          postType: postType === 'PROJECT' ? ptype : postType,
        };
      }),
    };
  };
  return useQuery({
    queryKey: ['useGetMyScrapedPostList'],
    queryFn: getMyScrapedPostList,
    enabled: collection === '내가 찜한 글',
  });
};

export const useGetMyCommentList = (collection: MyCollection) => {
  const getMyScrapedPostList = async () => {
    const { data } =
      await axiosInstance.get<MyPostDto.GetCommentList>(`/mypage/getComments`);

    return data.map(
      ({ postType, ptype, ...rest }) =>
        ({
          ...rest,
          postType: postType === 'PROJECT' ? ptype : postType,
        }) as UserComment,
    );
  };

  return useQuery({
    queryKey: ['useGetMyCommentList'],
    queryFn: getMyScrapedPostList,
    enabled: collection === '내가 쓴 댓글',
  });
};
