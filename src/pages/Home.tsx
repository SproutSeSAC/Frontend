import { useEffect } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import {
  initialUserProfile,
  useGetUserProfile,
} from '@/services/auth/authQueries';
import { useGetLoungeProjects } from '@/services/lounge/loungeQueries';

import { initialLogin } from '@/atoms/initialLoginAtom';

import { useCalendarData, useCheckLogin, useDialogContext } from '@/hooks';
import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';
import SideView from '@/layouts/SideView';
import { RoleValues } from '@/types';
import { getColorByRole } from '@/utils';
import { useAtom } from 'jotai';

import LoadingPage from '@/pages/LoadingPage';

import Tag from '@/components/common/Tag';
import Title from '@/components/common/Title';
import ScrollContainer from '@/components/common/container/ScrollContainer';
import LoungePostCard from '@/components/lounge/LoungePostCard';
import Calendar from '@/components/schedule/Calendar';
import DomainJobTechStackCard from '@/components/user/DomainJobTechStackCard';
import MyCourseProgressCard from '@/components/user/MyCourseProgressCard';
import ThisMonthOfMealPriceChart from '@/components/user/ThisMonthOfMealPriceChart';

export default function Home() {
  const [isInitialLogin, setIsInitialLogin] = useAtom(initialLogin);

  const {
    data: loungeList,
    isLoading: isGetLoungeListLoading, //
  } = useGetLoungeProjects({ page: 1, size: 10 });

  const {
    data: userProfile = initialUserProfile,
    isLoading: isGetUserProfileLoading, //
    isFetched,
  } = useGetUserProfile();

  const { name } = userProfile;

  const { fullCalendarEvents } = useCalendarData();

  const { isLogin } = useCheckLogin();

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLogin) {
      navigate('/login');
    }
  }, [isLogin, navigate]);

  const { showToast } = useDialogContext();

  useEffect(() => {
    if (isInitialLogin) {
      showToast('새싹 회원이 되신 것을 환영합니다!');
      setIsInitialLogin(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialLogin]);

  if ((!isFetched && isGetUserProfileLoading) || isGetLoungeListLoading)
    return <LoadingPage />;

  return (
    <>
      <MainView>
        <Header title={`${name}, 스프님 환영합니다!`} />

        <section>
          <Title title="나의 새싹 정보" className="mb-[10px]" />
          <div className="mb-14 flex h-full max-h-[380px] gap-4">
            <MyCourseProgressCard />
            <div className="relative max-h-[400px] w-full items-center gap-2">
              <DomainJobTechStackCard />
              <ThisMonthOfMealPriceChart />
            </div>
          </div>
        </section>

        <section>
          <div className="mb-[10px] flex w-full items-center justify-between pr-2">
            <Title
              title="나에게 딱 맞는 프로젝트를 만나보세요!"
              highlight="프로젝트"
            />
            <Link to="/lounge" className="tracking-tight text-gray2">
              라운지 바로가기
            </Link>
          </div>

          <ScrollContainer>
            {(loungeList?.projects || []).map(card => (
              <LoungePostCard key={card.id} card={card} />
            ))}
            <div />
          </ScrollContainer>
        </section>
      </MainView>
      <SideView>
        <Title title="새싹 주요일정" highlight="새싹" className="mb-2" />
        <Calendar type="small" events={fullCalendarEvents} />

        {/* 공지사항 */}
        <div className="mb-2 mt-6 flex items-center justify-between">
          <Title title="공지사항" className="!pl-0 text-sm" />
          <Link
            to="/announcement"
            className="p-1 text-xs font-semibold text-gray2"
          >
            더보기
          </Link>
        </div>

        <ul className="flex flex-col gap-2">
          {(['캠퍼스 매니저', '잡코디', '교육 매니저'] as RoleValues[]).map(
            item => (
              <li key={item} className="flex h-7 w-full items-center gap-1.5">
                <Tag
                  size="big"
                  color={getColorByRole(item)}
                  text={item}
                  className="!p-0 font-medium"
                  emphasisText
                />
                <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
                  1세대에게 직접 배우는 안드로이드 앱
                </span>
              </li>
            ),
          )}
        </ul>
      </SideView>
    </>
  );
}
