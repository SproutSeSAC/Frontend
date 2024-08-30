import { Link } from 'react-router-dom';

import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';
import SideView from '@/layouts/SideView';

import Title from '@/components/common/Title';
import EditButton from '@/components/common/button/EditButton';
import CourseDDayRadialBarCard from '@/components/user/CourseDDayRadialBarCard';
import InterestJobDomainSkillCard from '@/components/user/InterestJobDomainSkillCard';
import ThisMonthOfMealPriceChart from '@/components/user/ThisMonthOfMealPriceChart';

export default function Home() {
  const courseData = {
    course: 'UXUI 디자인 과정',
    campas: '마포캠퍼스',
    startDate: '2024.08.01',
    endDate: '2024.08.31',
  };

  return (
    <>
      <MainView>
        <Header title="김철수 스프님 환영합니다!" />

        <section>
          <div className="flex w-full items-center justify-between pr-2">
            <Title title="나의 새싹 정보" />
            <EditButton
              label="나의 새싹 정보 수정하기"
              className="mb-[10px] text-gray2"
            />
          </div>

          <div className="flex items-center gap-4 md:flex-col">
            <CourseDDayRadialBarCard data={courseData} />
            <InterestJobDomainSkillCard />
          </div>

          <ThisMonthOfMealPriceChart />
        </section>

        <section>
          <div className="flex w-full items-center justify-between pr-2">
            <Title
              title="나에게 딱 맞는 프로젝트를 만나보세요!"
              highlight="프로젝트"
            />
            <Link to="/lounge" className="mb-[10px] tracking-tight text-gray2">
              라운지 바로가기
            </Link>
          </div>
        </section>
      </MainView>

      <SideView>
        <div>사이드뷰</div>
      </SideView>
    </>
  );
}
