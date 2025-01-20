import { useSearchParams } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';

import { axiosInstance } from '@/services/axiosInstance';

import { PTYPE_PROJECT, PTYPE_STUDY } from '@/constants';
import { LoungeProjectFilter } from '@/types';
import { LoungeDto } from '@/types/lounge/loungeDto';

export const extractValidParams = (searchParams: URLSearchParams) => {
  return Object.fromEntries(
    Array.from(searchParams.entries()).filter(
      ([, value]) =>
        value === PTYPE_PROJECT ||
        value === PTYPE_STUDY ||
        value === 'onlyScraped',
    ),
  );
};

export const useGetLoungeProjects = (params: LoungeProjectFilter) => {
  const [searchParams] = useSearchParams();

  const { page, size, position, techStack, meetingType, sort } = params;

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
    ...sortParams,
    ...newSearchParams,
    ...positionParams,
    ...techStackParams,
    ...meetingTypeParams,
  };

  return useQuery({
    queryKey: ['useGetLoungeProjects', newParams],
    queryFn: async () => {
      const { data } = await axiosInstance.get<LoungeDto.GetProjectList>(
        '/project',
        {
          params: newParams,
        },
      );
      return data;
    },
  });
};

export const useGetLoungeProjectsDetail = (projectId: number | null) => {
  return useQuery({
    queryKey: ['useGetLoungeProjectsDetail', projectId],
    queryFn: async () => {
      const { data } = await axiosInstance.get<LoungeDto.GetProjectDetail>(
        `/project/${projectId}`,
      );
      return data;
    },
    enabled: !!projectId,
  });
};

export const useGetLoungeProjectsComment = (projectId: number) => {
  return useQuery({
    queryKey: ['useGetLoungeProjectsComment'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<LoungeDto.GetProjectComment>(
        `/project/${projectId}/comment`,
      );
      return data;
    },
  });
};

export const useGetEndingTomorrowProjects = () => {
  return useQuery({
    queryKey: ['useGetEndingTomorrowProjects'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<LoungeDto.GetEndingTomorrowList>(
        `/project/ending-tomorrow`,
      );
      return data;
    },
  });
};
