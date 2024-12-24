import { useSearchParams } from 'react-router-dom';

import {
  initialUserProfile,
  useGetUserProfile,
} from '@/services/auth/authQueries';

import { noticeTabList } from '@/constants/notice';
import { NoticeTabDisplayKey } from '@/types';
import { isManagerAndAdmin, updateQueryParams } from '@/utils';

import { NOTICE_SEARCH_PARAMS } from '@/pages/Notice';

import TabNavigation from '@/components/common/TabNavigation';

const EDIT = 'EDIT';

export default function NoticeTabNavigation() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabName = searchParams.get(NOTICE_SEARCH_PARAMS);

  const modifyNoticeId = searchParams.get('modifyNotice');

  const handleChangeValue = (type: NoticeTabDisplayKey) => {
    if (modifyNoticeId && tabName === EDIT && type === EDIT) return;
    updateQueryParams(
      searchParams,
      setSearchParams,
      NOTICE_SEARCH_PARAMS,
      type,
    );
  };

  const { data: userProfile = initialUserProfile } = useGetUserProfile();

  return (
    <TabNavigation
      tabList={noticeTabList}
      selectValue={tabName ?? 'ALL'}
      onChangeValue={handleChangeValue}
    >
      {isManagerAndAdmin(userProfile?.role) && (
        <button
          type="button"
          onClick={() => handleChangeValue(EDIT)}
          className={`cursor-pointer whitespace-pre px-4 pb-[19px] text-center ${tabName === EDIT ? 'border-b-2 border-text' : 'text-gray2'}`}
        >
          공지사항 {!modifyNoticeId ? '등록' : '수정'}
        </button>
      )}
    </TabNavigation>
  );
}
