import { useCallback } from 'react';

import { useSearchParams } from 'react-router-dom';

import { TAB_LIST } from '@/constants/lounge';
import { updateQueryParams } from '@/utils';

import TabNavigation from '@/components/common/TabNavigation';

export default function LoungeTabNavigation() {
  const [searchParams, setSearchParams] = useSearchParams();
  const pType = searchParams.get('pType');

  const modifyProjectId = searchParams.get('modifyProject');

  const handleChangeValue = useCallback(
    (type: string) => {
      updateQueryParams(searchParams, setSearchParams, 'pType', type);
    },
    [searchParams, setSearchParams],
  );

  const handleChange = () => {
    if (!modifyProjectId) {
      updateQueryParams(searchParams, setSearchParams, 'pType', 'EDIT');
    }
  };

  return (
    <TabNavigation
      selectValue={pType ?? 'ALL'}
      tabList={TAB_LIST}
      onChangeValue={handleChangeValue}
    >
      <div
        className={`box-border cursor-pointer justify-center whitespace-pre px-4 pb-[19px] ${pType === 'EDIT' ? 'border-b-2 border-black' : 'text-mainGray'}`}
      >
        <button type="button" onClick={handleChange}>
          {modifyProjectId ? '모집수정' : '모집하기'}
        </button>
      </div>
    </TabNavigation>
  );
}
