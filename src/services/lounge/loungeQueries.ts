import { useSearchParams } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';

import { axiosInstance } from '@/services/axiosInstance';

import { PTYPE_PROJECT, PTYPE_STUDY } from '@/constants';
import { LoungeProjectFilters } from '@/types';
import {
  GetEndingTomorrowProjects,
  GetLoungeProject,
  GetLoungeProjectComment,
  GetLoungeProjectDetail,
} from '@/types/lounge/loungeDto';

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

export const useGetLoungeProjects = (params: LoungeProjectFilters) => {
  const [searchParams] = useSearchParams();
  const newSearchParams =
    extractValidParams(searchParams).pType === 'onlyScraped'
      ? { onlyScraped: 'true' }
      : extractValidParams(searchParams);

  const { modify, ...rest } = params;

  const newParams = {
    ...rest,
    ...newSearchParams,
    position:
      rest.position && rest.position.length > 0
        ? rest.position.join(',')
        : undefined,
    techStack:
      rest.techStack && rest.techStack?.length > 0
        ? rest.techStack.join(',')
        : undefined,
  };

  return useQuery({
    queryKey: ['useGetLoungeProjects', newParams],
    queryFn: async () => {
      const { data } = await axiosInstance.get<GetLoungeProject>('/project', {
        params: newParams,
      });
      return data;
    },
  });
};

export const useGetLoungeProjectsDetail = (projectId: number | null) => {
  return useQuery({
    queryKey: ['useGetLoungeProjectsDetail', projectId],
    queryFn: async () => {
      const { data } = await axiosInstance.get<GetLoungeProjectDetail>(
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
      const { data } = await axiosInstance.get<GetLoungeProjectComment[]>(
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
      const { data } = await axiosInstance.get<GetEndingTomorrowProjects[]>(
        `/project/ending-tomorrow`,
      );
      return data;
    },
  });
};
