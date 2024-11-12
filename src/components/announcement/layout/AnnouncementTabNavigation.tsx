import { useEffect, useState } from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';

import TabNavigation from '../../common/TabNavigation';

import { announcementTabList } from '@/constants/announcement';
import { KeyOfAnnouncementTabKind } from '@/types';
import { updateQueryParams } from '@/utils';

export default function AnnouncementTabNavigation() {
  const navigate = useNavigate();

  const [tab, setTab] = useState<KeyOfAnnouncementTabKind>('ALL');
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (tab === 'ALL') {
      setSearchParams('', { replace: true });
    }
  }, [setSearchParams, tab]);

  const handelChangeValue = (type: string) => {
    navigate(`/announcement`, {
      replace: true,
    });
    setTab(type as KeyOfAnnouncementTabKind);
    updateQueryParams(searchParams, setSearchParams, 'ptype', type);
  };

  return (
    <TabNavigation
      tabList={announcementTabList}
      tabClassName=""
      selectValue={tab}
      onChangeValue={handelChangeValue}
    >
      <button
        type="button"
        onClick={() => {
          setTab('EDIT');
          navigate('/announcement', {
            replace: true,
          });
          updateQueryParams(searchParams, setSearchParams, 'ptype', 'EDIT');
        }}
        className={`cursor-pointer whitespace-pre px-4 pb-[19px] text-center ${tab === 'EDIT' ? 'border-b-2 border-text' : 'text-gray2'}`}
      >
        공지사항 등록
      </button>
    </TabNavigation>
  );
}
