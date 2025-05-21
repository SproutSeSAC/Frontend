import { useQuery } from '@tanstack/react-query';

import { axiosInstance } from '@/services/axiosInstance';

import { MyCollection, PaginationFilter } from '@/types';
import { MyPostDto, UserComment } from '@/types/mypage/myPostDto';

export const useGetMyPostList = (
  collection: MyCollection,
  params: MyPostDto.GetPostListParams,
) => {
  const postTypes =
    params.postTypes && params.postTypes.length !== 0
      ? { postTypes: params.postTypes?.join(',') }
      : {};

  const getMyPostList = async () => {
    const { data: postList } = await axiosInstance.get<MyPostDto.GetPostList>(
      `/mypage/getPost`,
      { params: { ...params, ...postTypes } },
    );

    return {
      ...postList,
      content: postList.content.map(({ postType, ptype, ...rest }) => {
        return {
          ptype,
          ...rest,
          postType: postType === 'PROJECT' ? ptype : postType,
        };
      }),
    };
  };

  return useQuery({
    queryKey: ['useGetMyPostList', params],
    queryFn: getMyPostList,
    enabled: collection === '내가 쓴 게시글',
  });
};

export const useGetMyScrapedPostList = (
  collection: MyCollection,
  params: PaginationFilter,
) => {
  const getMyScrapedPostList = async () => {
    const { data: postList } =
      await axiosInstance.get<MyPostDto.GetScrapedPostList>(
        `/mypage/getScrap`,
        { params },
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
    queryKey: ['useGetMyScrapedPostList', params],
    queryFn: getMyScrapedPostList,
    enabled: collection === '내가 찜한 글',
  });
};

export const useGetMyCommentList = (
  collection: MyCollection,
  params: MyPostDto.GetPostListParams,
) => {
  const postTypes =
    params.postTypes && params.postTypes.length !== 0
      ? { postTypes: params.postTypes?.join(',') }
      : {};

  const getMyCommentList = async () => {
    const { data } = await axiosInstance.get<MyPostDto.GetCommentList>(
      `/mypage/getComments`,
      { params: { ...params, ...postTypes } },
    );

    return {
      ...data,
      content: data.content.map(
        ({ postType, ptype, ...rest }) =>
          ({
            ...rest,
            postType: postType === 'PROJECT' ? ptype : postType,
          }) as UserComment,
      ),
    };
  };

  return useQuery({
    queryKey: ['useGetMyCommentList', params],
    queryFn: getMyCommentList,
    enabled: collection === '내가 쓴 댓글',
  });
};
