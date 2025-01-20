import { useCallback } from 'react';

import { useSearchParams } from 'react-router-dom';

import { TAB_LIST } from '@/constants/lounge';
import { updateQueryParams } from '@/utils';

import TabNavigation from '@/components/common/TabNavigation';

export default function LoungeTabNavigation() {
  const [searchParams, setSearchParams] = useSearchParams();
  const ptype = searchParams.get('ptype');

  const modifyProjectId = searchParams.get('modifyProject');

  const handleChangeValue = useCallback(
    (type: string) => {
      updateQueryParams(searchParams, setSearchParams, 'ptype', type);
    },
    [searchParams, setSearchParams],
  );

  const handleChange = () => {
    if (!modifyProjectId) {
      updateQueryParams(searchParams, setSearchParams, 'ptype', 'EDIT');
    }
  };

  return (
    <TabNavigation
      selectValue={ptype ?? 'ALL'}
      tabList={TAB_LIST}
      onChangeValue={handleChangeValue}
    >
      <div
        className={`box-border cursor-pointer justify-center whitespace-pre px-4 pb-[19px] ${ptype === 'EDIT' ? 'border-b-2 border-black' : 'text-mainGray'}`}
      >
        <button type="button" onClick={handleChange}>
          {modifyProjectId ? '모집수정' : '모집하기'}
        </button>
      </div>
    </TabNavigation>
  );
}
