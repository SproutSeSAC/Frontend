import { useSearchParams } from 'react-router-dom';

import { updateQueryParams } from '@/utils';

export const useHandleTabNavigation = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const tabName = searchParams.get('tab');

  const handleChangeTab = (type: string) => {
    updateQueryParams(searchParams, setSearchParams, 'tab', type);
  };

  return {
    tabName,
    handleChangeTab,
  };
};
