import { useEffect } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import { useGetUserProfile } from '@/services/auth/authQueries';
import { useGetLoungeProjects } from '@/services/lounge/loungeQueries';

import { userProfileAtom } from '@/atoms/userProfileAtom';

import { useCalendarData } from '@/hooks';
import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';
import SideView from '@/layouts/SideView';
import { getCookie } from '@/utils';
import { useAtom } from 'jotai';
import { FiChevronRight } from 'react-icons/fi';

import LoopLoading from '@/components/common/LoopLoading';
import Tag from '@/components/common/Tag';
import Title from '@/components/common/Title';
import ScrollContainer from '@/components/common/container/ScrollContainer';
import LoungePostCard from '@/components/lounge/LoungePostCard';
import Calendar from '@/components/schedule/Calendar';
import SmallCalendarBottomEvent from '@/components/schedule/SmallCalendarBottomEvent';
import DomainJobTechStackCard from '@/components/user/DomainJobTechStackCard';
import MyCourseProgressCard from '@/components/user/MyCourseProgressCard';
import ThisMonthOfMealPriceChart from '@/components/user/ThisMonthOfMealPriceChart';

export default function Home() {
  const [userProfile, setUserProfile] = useAtom(userProfileAtom);

  const { data: loungeList } = useGetLoungeProjects({ page: 1, size: 10 });

  const {
    data: profile,
    isLoading: isGetUserProfileLoading, //
  } = useGetUserProfile();

  const { fullCalendarEvents } = useCalendarData();

  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = getCookie('access_token');
    const refreshToken = getCookie('refresh_token');

    if (!accessToken || !refreshToken) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (profile) {
      setUserProfile(profile);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  // useEffect(() => {
  //   if (!isGetUserProfileLoading && !userProfile) {
  //     navigate('/signup');
  //   } else {
  //     navigate('/');
  //   }
  // }, [isGetUserProfileLoading, navigate, userProfile]);

  if (isGetUserProfileLoading)
    return (
      <MainView isEmpty>
        <LoopLoading />
        <span className="mb-4 mt-10 text-[40px] font-semibold">
          잠시만 기다려주세요
        </span>
        <span className="text-lg font-medium text-gray1">
          해당 페이지로 이동중입니다!
        </span>
      </MainView>
    );

  return (
    <>
      <MainView>
        <Header title={`${userProfile?.name}, 스프님 환영합니다!`} />

        <section>
          <Title title="나의 새싹 정보" className="mb-[10px]" />
          <div className="mb-14 flex h-full max-h-[380px] gap-4">
            {userProfile && (
              <>
                <MyCourseProgressCard userProfile={userProfile} />
                <div className="relative max-h-[400px] w-full items-center gap-2">
                  <DomainJobTechStackCard />
                  <ThisMonthOfMealPriceChart />
                </div>
              </>
            )}
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
        <Calendar type="small" events={fullCalendarEvents}>
          <ul className="mb-1 flex flex-col gap-2">
            {fullCalendarEvents.map(event => (
              <SmallCalendarBottomEvent
                key={event.title}
                date={new Date(event.start).toLocaleDateString()}
                title={event.title}
              />
            ))}
          </ul>
          <Link
            to="/schedule"
            type="button"
            className="my-2 flex w-full items-center justify-end"
          >
            <span className="text-sm text-gray1">
              새싹 캘린더 구독하러 가기
            </span>
            <FiChevronRight className="text-sm text-gray1" />
          </Link>
        </Calendar>

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
          {[1, 2, 3, 4, 5].map(item => (
            <li key={item} className="flex h-7 w-full gap-1.5">
              <Tag
                size="small"
                color="green"
                text="엑스퍼트"
                className="h-6 !px-1 font-semibold"
              />
              <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
                1세대에게 직접 배우는 안드로이드 앱
              </span>
            </li>
          ))}
        </ul>
      </SideView>
    </>
  );
}
