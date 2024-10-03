import { useEffect } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import { useGetUserProfile } from '@/services/auth/authQueries';
import { useGetLoungeProjects } from '@/services/lounge/loungeQueries';

import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';
import SideView from '@/layouts/SideView';
import { getCookie } from '@/utils';

import Tag from '@/components/common/Tag';
import Title from '@/components/common/Title';
import ScrollContainer from '@/components/common/container/ScrollContainer';
import LoungePostCard from '@/components/lounge/LoungePostCard';
import CourseDDayRadialBarCard from '@/components/user/CourseDDayRadialBarCard';
import DomainJobTechStackCard from '@/components/user/DomainJobTechStackCard';
import ThisMonthOfMealPriceChart from '@/components/user/ThisMonthOfMealPriceChart';

export default function Home() {
  const { data: loungeList } = useGetLoungeProjects({ page: 1, size: 10 });

  const { data: userProfile, isLoading: isGetUserProfileLoading } =
    useGetUserProfile();

  const courseData = {
    course: userProfile ? userProfile.courseTitle : '',
    campus: userProfile ? `${userProfile.campusName} 캠퍼스` : '',
    startDate: '2024.08.01',
    endDate: '2024.08.31',
  };

  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = getCookie('access_token');
    const refreshToken = getCookie('refresh_token');

    if (!accessToken || !refreshToken) {
      navigate('/login');
    }
  }, [navigate]);

  // useEffect(() => {
  //   if (!isGetUserProfileLoading && !userProfile) {
  //     navigate('/signup');
  //   } else {
  //     navigate('/');
  //   }
  // }, [isGetUserProfileLoading, navigate, userProfile]);

  if (isGetUserProfileLoading) return null;

  return (
    <>
      <MainView>
        <Header title={`${userProfile?.name} 스프님 환영합니다!`} />

        <section>
          <Title title="나의 새싹 정보" className="mb-[10px]" />

          {userProfile && (
            <div className="relative flex items-center gap-4 md:flex-col">
              <CourseDDayRadialBarCard data={courseData} />
              <DomainJobTechStackCard />
            </div>
          )}

          <ThisMonthOfMealPriceChart />
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
        <Title title="주요일정" />
        <div className="mb-10 mt-2 h-60 rounded-xl border bg-white shadow-card" />

        <div className="mb-2 flex items-center justify-between">
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
