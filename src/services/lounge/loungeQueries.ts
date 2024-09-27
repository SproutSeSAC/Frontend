import { useSearchParams } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';

import { axiosInstance } from '../axiosInstance';

import { PTYPE_PROJECT, PTYPE_STUDY } from '@/constants';
import { FilterType } from '@/types';
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

export const useGetLoungeProjects = (
  params: LoungeDto.Request.GetLoungeProjects,
) => {
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
      const { data } =
        await axiosInstance.get<LoungeDto.Response.GetLoungeProject>(
          '/project',
          {
            params: newParams,
          },
        );
      return data;
    },
  });
};

export const useGetLoungeTechStackFilterList = () => {
  return useQuery({
    queryKey: ['useGetLoungeTechStackFilterList'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<FilterType[]>('/techStack');
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
