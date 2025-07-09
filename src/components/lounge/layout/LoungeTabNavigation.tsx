import { useCallback } from 'react';

import { useSearchParams } from 'react-router-dom';

import { loungeTabList } from '@/constants';
import { updateQueryParams } from '@/utils';

import TabNavigation from '@/components/common/TabNavigation';

export default function LoungeTabNavigation() {
  const [searchParams, setSearchParams] = useSearchParams();
  const pType = searchParams.get('pType');

  const handleChangeValue = useCallback(
    (type: string) => {
      updateQueryParams(searchParams, setSearchParams, 'pType', type);
    },
    [searchParams, setSearchParams],
  );

  return (
    <TabNavigation
      selectValue={pType ?? 'ALL'}
      tabList={loungeTabList}
      onChangeValue={handleChangeValue}
      tabClassName="!px-4"
    />
  );
}
