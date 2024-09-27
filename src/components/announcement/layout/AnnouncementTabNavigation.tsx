import { useEffect, useState } from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';

import TabNavigation from '../../common/TabNavigation';

import { updateQueryParams } from '@/utils';

const TAB_LIST = [
  { text: '전체', type: 'all' },
  { text: '기관매니저', type: '기관매니저' },
  { text: '교육매니저', type: '교육매니저' },
  { text: '잡코디', type: '잡코디' },
  { text: '북마크', type: '북마크' },
];

export default function AnnouncementTabNavigation() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState('all');

  // const ptype = searchParams.get('ptype');

  useEffect(() => {
    if (tab === 'all') {
      setSearchParams('', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const handelChangeValue = (type: string) => {
    navigate(`/announcement`, {
      replace: true,
    });
    setTab(type);
    updateQueryParams(searchParams, setSearchParams, 'ptype', type);
  };

  return (
    <TabNavigation
      tabList={TAB_LIST}
      tabClassName="w-[126px]"
      selectValue={tab}
      onChangeValue={type => handelChangeValue(type)}
    >
      <div
        className={`box-border w-[126px] cursor-pointer justify-center pb-[19px] text-center ${tab === 'edit' ? 'border-b-2 border-text' : 'text-gray2'}`}
      >
        <button
          type="button"
          onClick={() => {
            setTab('edit');
            navigate('/announcement', {
              replace: true,
            });
            updateQueryParams(searchParams, setSearchParams, 'ptype', 'edit');
          }}
        >
          공지사항 등록
        </button>
      </div>
    </TabNavigation>
  );
}
