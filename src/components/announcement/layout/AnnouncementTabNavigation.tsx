import { useEffect, useState } from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';

import TabNavigation from '../../common/TabNavigation';

import { Role } from '@/types';
import { updateQueryParams } from '@/utils';

type AnnouncementRole = Pick<
  Role,
  'CAMPUS_MANAGER' | 'EDU_MANAGER' | 'JOB_COORDINATOR'
>;

type AnnouncementText =
  | Role[keyof AnnouncementRole]
  | '전체'
  | '북마크'
  | '공지사항 등록';

type AnnouncementType = keyof AnnouncementRole | 'all' | 'bookmark' | 'edit';

type AnnouncementTab = {
  text: AnnouncementText;
  type: AnnouncementType;
};

const TAB_LIST: AnnouncementTab[] = [
  { text: '전체', type: 'all' },
  { text: '캠퍼스 매니저', type: 'CAMPUS_MANAGER' },
  { text: '교육 매니저', type: 'EDU_MANAGER' },
  { text: '잡코디', type: 'JOB_COORDINATOR' },
  { text: '북마크', type: 'bookmark' },
];

export default function AnnouncementTabNavigation() {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const [tab, setTab] = useState<AnnouncementType>('all');

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
    setTab(type as AnnouncementType);
    updateQueryParams(searchParams, setSearchParams, 'ptype', type);
  };

  return (
    <TabNavigation
      tabList={TAB_LIST}
      tabClassName="w-[126px]"
      selectValue={tab}
      onChangeValue={handelChangeValue}
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
          className="whitespace-pre"
        >
          공지사항 등록
        </button>
      </div>
    </TabNavigation>
  );
}
