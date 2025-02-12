import { useEffect } from 'react';

import { Link } from 'react-router-dom';

import {
  initialUserProfile,
  useGetUserProfile,
} from '@/services/auth/authQueries';
import { useGetLoungeProjects } from '@/services/lounge/loungeQueries';

import { initialLogin } from '@/atoms/initialLoginAtom';

import { useDialogContext } from '@/hooks';
import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';
import { useAtom } from 'jotai';

import LoadingPage from '@/pages/LoadingPage';

import Title from '@/components/common/Title';
import SwiperContainer from '@/components/common/container/SwiperContainer';
import LoungePostCard from '@/components/lounge/LoungePostCard';
import Calendar from '@/components/schedule/Calendar';
import MyCourseProgressCard from '@/components/user/MyCourseProgressCard';
import NoticeDisplayList from '@/components/user/NoticeDisplayList';

export default function Home() {
  const [isFirstLogin, setIsFirstLogin] = useAtom(initialLogin);

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

  const { showToast } = useDialogContext();

  useEffect(() => {
    if (isFirstLogin) {
      showToast('새싹 회원이 되신 것을 환영합니다!');
      setIsFirstLogin(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFirstLogin]);

  if ((!isFetched && isGetUserProfileLoading) || isGetLoungeListLoading)
    return <LoadingPage />;

  const linkButtonStyle = 'pr-[10px] tracking-tight text-darkGray-hover';

  return (
    <MainView className="pb-20">
      <Header title={`${name} 스프님, 환영합니다!`} />

      <div className="mb-14 grid grid-cols-[1.2fr_1fr_1fr] grid-rows-[auto_auto] gap-x-8">
        <section className="relative flex h-full flex-col">
          <Title title="나의 새싹 정보" className="mb-[14px]" />
          <MyCourseProgressCard />
        </section>

        <section>
          <div className="mb-[14px] flex items-center justify-between">
            <Title title="주요 일정" />
            <Link to="/schedule" className={linkButtonStyle}>
              더보기
            </Link>
          </div>
          <Calendar type="small" className="h-[509px]" />
        </section>

        <section>
          <div className="mb-[14px] flex items-center justify-between">
            <Title title="공지사항" />
            <Link to="/notice" className={linkButtonStyle}>
              더보기
            </Link>
          </div>
          <div className="flex h-[509px] w-full flex-col justify-between overflow-hidden rounded-[20px] bg-white px-6 pb-6 pt-7">
            <span className="mb-4 font-semibold">마감임박</span>
            <NoticeDisplayList title="마감임박" />
            <span className="my-4 border-t pt-4 font-semibold">NEW</span>
            <NoticeDisplayList title="NEW" />
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

        <SwiperContainer slideList={loungeList?.projects || []}>
          {item => <LoungePostCard card={item} />}
        </SwiperContainer>
      </section>
    </MainView>
  );
}
