import { useSearchParams } from 'react-router-dom';

import TabNavigation from '../../common/TabNavigation';

import { announcementTabList } from '@/constants/announcement';
import { updateQueryParams } from '@/utils';

export default function AnnouncementTabNavigation() {
  const [searchParams, setSearchParams] = useSearchParams();

  const params = searchParams.get('noticeType');

  const handelChangeValue = (type: string) => {
    updateQueryParams(searchParams, setSearchParams, 'noticeType', type);
  };

  return (
    <TabNavigation
      tabList={announcementTabList}
      selectValue={params ?? 'ALL'}
      onChangeValue={handelChangeValue}
    >
      <button
        type="button"
        onClick={() =>
          updateQueryParams(searchParams, setSearchParams, 'noticeType', 'EDIT')
        }
        className={`cursor-pointer whitespace-pre px-4 pb-[19px] text-center ${params === 'EDIT' ? 'border-b-2 border-text' : 'text-gray2'}`}
      >
        공지사항 등록
      </button>
    </TabNavigation>
  );
}
