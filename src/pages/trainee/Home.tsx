import { useEffect } from 'react';

import { Link } from 'react-router-dom';

import { useGetUserProfile } from '@/services/auth/authQueries';
import { useGetIsWaitingAcl } from '@/services/calendar/calendarQueries';
import { useGetLoungeProjectList } from '@/services/post/loungeQueries';

import { initialLogin } from '@/atoms/initialLoginAtom';

import { useCalendarEvents, useDialogContext } from '@/hooks';
import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';
import { hasAdmin, isSuperAdmin } from '@/utils';
import { useAtom } from 'jotai';

import LoadingPage from '@/pages/LoadingPage';

import Calendar from '@/components/calendar/Calendar';
import Title from '@/components/common/Title';
import RoleSwitchButton from '@/components/common/button/RoleSwitchButton';
import SwiperContainer from '@/components/common/container/SwiperContainer';
import LoungePostCard from '@/components/lounge/LoungePostCard';
import NoticeDisplayList from '@/components/notice/layout/NoticeDisplayList';
import MyCourseProgressCard from '@/components/user/MyCourseProgressCard';

export default function Home() {
  const [isFirstLogin, setIsFirstLogin] = useAtom(initialLogin);

  const {
    data: loungeList,
    isLoading: isGetLoungeListLoading, //
  } = useGetLoungeProjectList({ page: 1, size: 10 });

  const {
    data: userProfile,
    isLoading: isGetUserProfileLoading, //
    isFetched,
  } = useGetUserProfile();

  const { data: isWaitingAcl } = useGetIsWaitingAcl(
    userProfile?.courseList || [],
    {
      enabled:
        isSuperAdmin(userProfile?.role) &&
        (userProfile?.courseList || []).length > 0,
    },
  );

  const {
    fullCalendarSideViewEvents,
    fullCalendarEvents,
    isCourseCalendarLoadingArr,
  } = useCalendarEvents();

  const { showToast } = useDialogContext();

  useEffect(() => {
    if (isFirstLogin) {
      showToast('새싹 회원이 되신 것을 환영합니다!');
      setIsFirstLogin(false);
    }

    if (isWaitingAcl) {
      showToast('권한 대기중인 매니저가 있습니다.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFirstLogin, isWaitingAcl]);

  if ((!isFetched && isGetUserProfileLoading) || isGetLoungeListLoading)
    return <LoadingPage />;

  const linkButtonStyle = 'pr-[10px] tracking-tight text-darkGray';

  return (
    <MainView className="pb-20">
      <Header title={`${userProfile?.name} 스프님, 환영합니다!`}>
        {hasAdmin(userProfile?.role) && (
          <RoleSwitchButton title="관리자로 전환" />
        )}
      </Header>

      <div className="mb-14 grid grid-cols-[1.2fr_1fr_1fr] grid-rows-[auto_auto] gap-x-8">
        <section className="relative overflow-hidden">
          <Title title="나의 새싹 정보" className="mb-[14px]" />
          <MyCourseProgressCard />
        </section>

        <section className="overflow-hidden">
          <Title title="주요 일정" className="mb-[14px]" />
          <Calendar
            type="small"
            className="h-[509px]"
            events={fullCalendarEvents}
            sideViewEvents={fullCalendarSideViewEvents}
            isCourseCalendarLoadingArr={isCourseCalendarLoadingArr}
          />
        </section>

        <section className="overflow-hidden">
          <div className="mb-[14px] flex items-center justify-between">
            <Title title="공지사항" />
            <Link to="/notice" className={linkButtonStyle}>
              더보기
            </Link>
          </div>
          <div className="flex h-[509px] flex-col justify-between gap-5 overflow-hidden rounded-[20px] bg-white px-6 pb-6 pt-7">
            <div className="flex h-full flex-col border-b pb-4">
              <span className="mb-4 text-darkGray-active">마감임박</span>
              <NoticeDisplayList title="마감임박" />
            </div>

            <div className="flex h-full flex-col">
              <span className="mb-4 text-darkGray-active">NEW</span>
              <NoticeDisplayList title="NEW" />
            </div>
          </div>
        </section>
      </div>

      <section>
        <div className="mb-[22px] flex w-full items-center justify-between pr-2">
          <Title
            title="나에게 딱 맞는 프로젝트를 만나보세요!"
            highlight="프로젝트"
          />
          <Link to="/lounge" className={linkButtonStyle}>
            라운지 바로가기
          </Link>
        </div>

        <SwiperContainer
          slideList={loungeList?.projects || []}
          slideItemClassName="min-w-[275px]"
        >
          {item => <LoungePostCard card={item} />}
        </SwiperContainer>
      </section>
    </MainView>
  );
}
