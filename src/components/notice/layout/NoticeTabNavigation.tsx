import { useSearchParams } from 'react-router-dom';

import {
  initialUserProfile,
  useGetUserProfile,
} from '@/services/auth/authQueries';

import TabNavigation from '../../common/TabNavigation';

import { noticeTabList } from '@/constants/notice';
import { KeyOfNoticeTabKind } from '@/types';
import { isManagerAndAdmin, updateQueryParams } from '@/utils';

export default function NoticeTabNavigation() {
  const [searchParams, setSearchParams] = useSearchParams();

  const params = searchParams.get('roleType');

  const handleChangeValue = (type: KeyOfNoticeTabKind) => {
    updateQueryParams(searchParams, setSearchParams, 'roleType', type);
  };

  const { data: userProfile = initialUserProfile } = useGetUserProfile();

  return (
    <TabNavigation
      tabList={noticeTabList}
      selectValue={params ?? 'ALL'}
      onChangeValue={handleChangeValue}
    >
      {isManagerAndAdmin(userProfile?.role) && (
        <button
          type="button"
          onClick={() => handleChangeValue('EDIT')}
          className={`cursor-pointer whitespace-pre px-4 pb-[19px] text-center ${params === 'EDIT' ? 'border-b-2 border-text' : 'text-gray2'}`}
        >
          공지사항 등록
        </button>
      )}
    </TabNavigation>
  );
}
