import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import { axiosInstance } from '@/services/axiosInstance';

import { AxiosResponse } from 'axios';

type JobListData = {
  jobList: {
    id: number;
    job: string;
  }[];
};

type DomainListData = {
  domainList: {
    id: number;
    domain: string;
  }[];
};

type TechStackListData = {
  techStackList: {
    id: number;
    techStack: string;
  }[];
};

export const useGetJobList = (
  options?: UseQueryOptions<JobListData['jobList']>,
) => {
  const getJobList = async () => {
    const response: AxiosResponse<JobListData> = await axiosInstance.get(
      '/specifications/jobList',
    );
    return response.data.jobList;
  };

  return useQuery<JobListData['jobList']>({
    queryKey: ['jobList'],
    queryFn: getJobList,
    ...options,
  });
};

export const useGetDomainList = (
  options?: UseQueryOptions<DomainListData['domainList']>,
) => {
  const getDomainList = async () => {
    const response: AxiosResponse<DomainListData> = await axiosInstance.get(
      '/specifications/domainList',
    );
    return response.data.domainList;
  };

  return useQuery<DomainListData['domainList']>({
    queryKey: ['domainList'],
    queryFn: getDomainList,
    ...options,
  });
};

export const useGetTechStackList = (
  options?: UseQueryOptions<TechStackListData['techStackList']>,
) => {
  const getTechStackList = async () => {
    const response: AxiosResponse<TechStackListData> = await axiosInstance.get(
      '/specifications/techStackList',
    );
    return response.data.techStackList;
  };

  return useQuery<TechStackListData['techStackList']>({
    queryKey: ['techStackList'],
    queryFn: getTechStackList,
    ...options,
  });
};
