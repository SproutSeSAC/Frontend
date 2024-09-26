import { useEffect, useState } from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';

import { PTYPE_PROJECT, PTYPE_STUDY } from '@/constants';
import { updateQueryParams } from '@/utils';

import TabNavigation from '@/components/common/TabNavigation';

const TAB_LIST = [
  { text: '전체', type: 'ALL' },
  { text: '프로젝트', type: PTYPE_PROJECT },
  { text: '스터디', type: PTYPE_STUDY },
  { text: '찜 모아보기', type: 'onlyScraped' },
];

export default function LoungeTabNavigation() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState('ALL');

  useEffect(() => {
    if (tab === 'ALL') {
      setSearchParams('', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const handelChangeValue = (type: string) => {
    navigate(`/lounge`, {
      replace: true,
    });
    setTab(type);
    updateQueryParams(searchParams, setSearchParams, 'pType', type);
  };

  return (
    <TabNavigation
      selectValue={tab}
      tabList={TAB_LIST}
      onChangeValue={type => handelChangeValue(type)}
    >
      <div
        className={`box-border w-20 cursor-pointer justify-center pb-[19px] ${tab === 'EDIT' ? 'border-b-2 border-text' : 'text-gray2'}`}
      >
        <button
          type="button"
          onClick={() => {
            setTab('EDIT');
            navigate('/lounge', {
              replace: true,
            });
            updateQueryParams(searchParams, setSearchParams, 'pType', 'EDIT');
          }}
        >
          모집하기
        </button>
      </div>
    </TabNavigation>
  );
}
