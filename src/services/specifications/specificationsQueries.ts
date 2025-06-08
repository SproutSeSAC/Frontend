import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import { axiosInstance } from '@/services/axiosInstance';

import { SpecificationsDto } from '@/types';

export const useGetJobList = (
  options?: UseQueryOptions<SpecificationsDto.GetJobList['jobList']>,
) => {
  const getJobList = async () => {
    const response = await axiosInstance.get<SpecificationsDto.GetJobList>(
      '/specifications/jobList',
    );
    return response.data.jobList.sort((a, b) => a.job.localeCompare(b.job));
  };

  return useQuery<SpecificationsDto.GetJobList['jobList']>({
    queryKey: ['jobList'],
    queryFn: getJobList,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useGetDomainList = (
  options?: UseQueryOptions<SpecificationsDto.GetDomainList['domainList']>,
) => {
  const getDomainList = async () => {
    const response = await axiosInstance.get<SpecificationsDto.GetDomainList>(
      '/specifications/domainList',
    );
    return response.data.domainList.sort((a, b) =>
      a.domain.localeCompare(b.domain),
    );
  };

  return useQuery<SpecificationsDto.GetDomainList['domainList']>({
    queryKey: ['domainList'],
    queryFn: getDomainList,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useGetTechStackList = (
  options?: UseQueryOptions<SpecificationsDto.GetTechStack['techStackList']>,
) => {
  const getTechStackList = async () => {
    const res = await axiosInstance.get<SpecificationsDto.GetTechStack>(
      '/specifications/techStackList',
    );
    return res.data.techStackList.sort((a, b) =>
      a.techStack.localeCompare(b.techStack),
    );
  };

  return useQuery<SpecificationsDto.GetTechStack['techStackList']>({
    queryKey: ['techStackList'],
    queryFn: getTechStackList,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    ...options,
  });
};
