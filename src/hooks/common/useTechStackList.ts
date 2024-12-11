import { useMemo } from 'react';

import { useGetTechStackList } from '@/services/specifications/specificationsQueries';

export const useTechStackList = () => {
  const { data, isLoading: isTechStackListLoading } = useGetTechStackList();

  const techStackList = useMemo(() => {
    return (data || []).map(item => ({
      id: item.id,
      name: item.techStack,
      iconImageUrl: item.iconImageUrl,
      type: item.jobName,
    }));
  }, [data]);

  return { techStackList, isTechStackListLoading };
};
