import { useSearchParams } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';

import { axiosInstance } from '../axiosInstance';

import { PTYPE_PROJECT, PTYPE_STUDY } from '@/constants';
import { FilterType } from '@/types';
import {
  GetLoungeProject,
  GetLoungeProjectComment,
  GetLoungeProjectDetail,
  GetLoungeProjects,
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

export const useGetLoungeProjects = (params: GetLoungeProjects) => {
  const [searchParams] = useSearchParams();
  const newSearchParams =
    extractValidParams(searchParams).pType === 'onlyScraped'
      ? { onlyScraped: 'true' }
      : extractValidParams(searchParams);

  const newParams = {
    ...params,
    ...newSearchParams,
    position: params.position?.join(','),
    techStack: params.techStack?.join(','),
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

export const useGetLoungePositionsFilterList = () => {
  return useQuery({
    queryKey: ['useGetLoungePositionsFilterList'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<FilterType[]>('/positions');
      return data;
    },
  });
};

export const useGetLoungeProjectsDetail = (projectId: number) => {
  return useQuery({
    queryKey: ['useGetLoungeProjectsDetail'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<GetLoungeProjectDetail>(
        `/project/${projectId}`,
      );
      return data;
    },
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
