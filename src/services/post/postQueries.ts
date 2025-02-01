import { useSearchParams } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';

import { axiosInstance } from '@/services/axiosInstance';

import { LoungeProjectFilter } from '@/types';
import { extractValidParams } from '@/utils';

type PostType = 'notice' | 'project';

// 게시글 목록 조회 API
export const useGetPostList = <T>(
  postType: PostType,
  params: LoungeProjectFilter,
) => {
  const [searchParams] = useSearchParams();

  const { page, size, position, techStack, meetingType, sort, keyword } =
    params;

  const newSearchParams =
    extractValidParams(searchParams).pType === 'onlyScraped'
      ? { onlyScraped: true }
      : extractValidParams(searchParams);

  const positionParams =
    position && position.length > 0 ? { position: position.join(',') } : {};

  const techStackParams =
    techStack && techStack?.length > 0
      ? { techStack: techStack.join(',') }
      : {};

  const meetingTypeParams = meetingType ? { meetingType } : {};

  const sortParams = sort ? { sort } : {};

  const newParams = {
    page,
    size,
    keyword,
    ...sortParams,
    ...newSearchParams,
    ...positionParams,
    ...techStackParams,
    ...meetingTypeParams,
  };

  return useQuery({
    queryKey: ['useGetPostList', postType],
    queryFn: async () => {
      const { data } = await axiosInstance.get<T>(`/posts/type/${postType}`, {
        params: newParams,
      });
      return data;
    },
  });
};

// 특정 게시글 상세 조회 API
export const useGetPostDetail = <T>(postId: number) => {
  return useQuery({
    queryKey: ['useGetPostDetail', postId],
    queryFn: async () => {
      const { data } = await axiosInstance.get<T>(`/posts/${postId}`);
      return data;
    },
  });
};

// 게시글 Linked ID 조회 API
export const useGetPostLinkedId = (postId: number) => {
  return useQuery({
    queryKey: ['useGetPostLinkedId', postId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/posts/${postId}/link`);
      return data;
    },
  });
};
