import { useSearchParams } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';

import { axiosInstance } from '@/services/axiosInstance';

import { LoungeProjectFilter } from '@/types';
import { LoungeDto } from '@/types/lounge/loungeDto';
import { extractValidParams } from '@/utils';

export const useGetLoungeProjectList = (params: LoungeProjectFilter) => {
  const [searchParams] = useSearchParams();

  const { page, size, position, techStack, meetingType, sort, keyword } =
    params;

  const tabParams =
    extractValidParams(searchParams).pType === 'ALL'
      ? {}
      : extractValidParams(searchParams);

  const onScrapedParams =
    extractValidParams(searchParams).pType === 'onlyScraped'
      ? { onlyScraped: true }
      : tabParams;

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
    ...positionParams,
    ...techStackParams,
    ...meetingTypeParams,
    ...onScrapedParams,
  };

  const isEditing = extractValidParams(searchParams).pType === 'EDIT';

  return useQuery<LoungeDto.GetProjectList>({
    queryKey: ['useGetLoungeProjectList', newParams],
    queryFn: async () => {
      const { data } = await axiosInstance.get<LoungeDto.GetProjectList>(
        '/project',
        { params: newParams },
      );
      return data;
    },
    enabled: !isEditing,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
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
