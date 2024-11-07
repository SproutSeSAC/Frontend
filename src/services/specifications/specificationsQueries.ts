import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import { axiosInstance } from '@/services/axiosInstance';

import { SpecificationsDto } from '@/types';
import { AxiosResponse } from 'axios';

export const useGetJobList = (
  options?: UseQueryOptions<SpecificationsDto.GetJobList['jobList']>,
) => {
  const getJobList = async () => {
    const response: AxiosResponse<SpecificationsDto.GetJobList> =
      await axiosInstance.get('/specifications/jobList');
    return response.data.jobList;
  };

  return useQuery<SpecificationsDto.GetJobList['jobList']>({
    queryKey: ['jobList'],
    queryFn: getJobList,
    initialData: [],
    ...options,
  });
};

export const useGetDomainList = (
  options?: UseQueryOptions<SpecificationsDto.GetDomainList['domainList']>,
) => {
  const getDomainList = async () => {
    const response: AxiosResponse<SpecificationsDto.GetDomainList> =
      await axiosInstance.get('/specifications/domainList');
    return response.data.domainList;
  };

  return useQuery<SpecificationsDto.GetDomainList['domainList']>({
    queryKey: ['domainList'],
    queryFn: getDomainList,
    initialData: [],
    ...options,
  });
};

export const useGetTechStackList = (
  options?: UseQueryOptions<SpecificationsDto.GetTechStack['techStackList']>,
) => {
  const getTechStackList = async () => {
    const response: AxiosResponse<SpecificationsDto.GetTechStack> =
      await axiosInstance.get('/specifications/techStackList');
    return response.data.techStackList;
  };

  return useQuery<SpecificationsDto.GetTechStack['techStackList']>({
    queryKey: ['techStackList'],
    queryFn: getTechStackList,
    initialData: [],
    ...options,
  });
};
