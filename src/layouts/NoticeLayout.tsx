import {
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

import { useGetUserProfile } from '@/services/auth/authQueries';

import { NOTICE_TAB_LIST } from '@/constants';
import { useCalendarEvents } from '@/hooks';
import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';
import SideView from '@/layouts/SideView';
import { NoticeTabDisplayKey } from '@/types';
import { isTrainee, updateQueryParams } from '@/utils';

import { NOTICE_SEARCH_PARAMS } from '@/pages/trainee/Notice';

import Calendar from '@/components/calendar/Calendar';
import TabNavigation from '@/components/common/TabNavigation';
import Title from '@/components/common/Title';
import SquareButton from '@/components/common/button/SquareButton';

const EDIT = 'EDIT';

export default function NoticeLayout() {
  const navigate = useNavigate();

  const { pathname } = useLocation();

  const { data: userProfile } = useGetUserProfile();

  const [searchParams, setSearchParams] = useSearchParams();
  const tabName = searchParams.get(NOTICE_SEARCH_PARAMS);
  const currTab = searchParams.get('tab');

  const modifyNoticeId = searchParams.get('modifyNotice');

  const editType = modifyNoticeId ? '수정' : '등록';

  const handleChangeValue = (type: NoticeTabDisplayKey) => {
    if (type === 'EDIT') {
      return navigate('/notice?tab=EDIT');
    }
    return updateQueryParams(
      searchParams,
      setSearchParams,
      NOTICE_SEARCH_PARAMS,
      type,
    );
  };

  const {
    fullCalendarEvents,
    fullCalendarSideViewEvents,
    isCourseCalendarLoadingArr,
  } = useCalendarEvents();

  return (
    <>
      <MainView>
        <Header title={`공지사항 ${currTab === 'EDIT' ? editType : ''}`} />
        {!pathname.includes('notice/post') && currTab !== 'EDIT' && (
          <TabNavigation
            tabList={NOTICE_TAB_LIST}
            selectValue={tabName ?? 'ALL'}
            onChangeValue={handleChangeValue}
          />
        )}
        <Outlet />
      </MainView>

      <SideView>
        <Title title="주요일정" className="mb-[14px]" />
        <Calendar
          type="small"
          events={fullCalendarEvents}
          sideViewEvents={fullCalendarSideViewEvents}
          isCourseCalendarLoadingArr={isCourseCalendarLoadingArr}
        />
        {!isTrainee(userProfile?.role) && (
          <SquareButton
            color="mainGreen"
            type="button"
            name="공지사항 등록"
            className="mt-4 w-full !py-3 font-semibold"
            onClick={() => handleChangeValue(EDIT)}
          />
        )}
        <SquareButton
          color="lightGreen"
          type="button"
          name="특강/행사 신청 내역 보기"
          className="mt-4 w-full !py-3 font-semibold"
          onClick={() => navigate('/session-status')}
        />
      </SideView>
    </>
  );
}
