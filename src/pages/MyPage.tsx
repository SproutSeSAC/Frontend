import { useMemo } from 'react';

import {
  initialUserProfileCard,
  useGetUserProfileCard,
} from '@/services/auth/authQueries';

import imgUrl from '@/assets/images/faq.png';
import { faqList } from '@/constants/faq';
import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';

import Icon from '@/components/common/Icon';
import Title from '@/components/common/Title';
import Faq from '@/components/faq/Faq';
import ApplicationListOfSessionsCard from '@/components/mypage/ApplicationListOfSessionsCard';
import MyCollection from '@/components/mypage/MyCollection';
import UserNameImageCard from '@/components/user/UserNameImageCard';

export default function MyPage() {
  const { data: userProfileCard = initialUserProfileCard, isLoading } =
    useGetUserProfileCard();

  const {
    profile: { name },
    study: { course: courseList, campus: campusList, email },
  } = userProfileCard;

  const sortedCourseList = useMemo(() => {
    return courseList.length === 1
      ? courseList
      : courseList.sort((a, b) => (a.courseName > b.courseName ? 1 : -1));
  }, [courseList]);

  const userInfoList = [
    {
      label: 'E-mail',
      value: <span>{email}</span>,
    },
    {
      label: '소속 캠퍼스',
      value: (
        <span>{campusList.map(({ campusName }) => campusName).join(', ')}</span>
      ),
    },
    {
      label: '소속 교육과정',
      value: (
        <div className="peer flex w-full items-center truncate">
          {courseList.length > 1 ? (
            sortedCourseList.slice(0, 1).map(({ courseName }) => (
              <span
                className="w-full overflow-hidden truncate text-end"
                key={courseName}
              >
                {courseName}
              </span>
            ))
          ) : (
            <span className="w-full overflow-hidden truncate text-end">
              {courseList[0]?.courseName}
            </span>
          )}
          {courseList.length > 1 && (
            <Icon name="ChevronDown" className="size-5" />
          )}
        </div>
      ),
    },
  ];

  if (isLoading) return null;

  return (
    <MainView>
      <Header title="마이페이지" />

      <section className="mb-16 flex gap-x-4 [&>*:first-child]:w-[280px] [&>*:last-child]:w-[30vw] [&>*:last-child]:lg:w-[300px]">
        <UserNameImageCard data={userProfileCard.profile} />

        <ul className="relative flex h-full w-[36vw] flex-col justify-between rounded-xl bg-darkGreen px-6 py-4 shadow-card peer-hover:cursor-pointer">
          {userInfoList.map(({ value, label }) => (
            <li
              key={label}
              className={`flex w-full items-start justify-between py-2.5 font-medium text-white ${label === '소속 교육과정' ? 'peer' : ''}`}
            >
              <span className="mr-3 whitespace-nowrap font-medium text-darkGreen-active">
                {label}:
              </span>

              {value}
            </li>
          ))}

          {sortedCourseList.length > 1 && (
            <div className="absolute right-5 top-40 hidden rounded-xl bg-white p-5 shadow-card hover:block peer-hover:block">
              <header className="flex items-center justify-between border-b border-mainGray pb-2 text-black">
                <h4>교육과정 전체 목록</h4>
                <span>총 {sortedCourseList.length}개</span>
              </header>

              <ul className="mt-3 flex flex-col gap-y-3">
                {sortedCourseList.map(({ courseName }, index) => (
                  <li
                    className="w-full overflow-hidden truncate text-black"
                    key={courseName}
                  >
                    {index + 1}. {courseName}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </ul>

        <ApplicationListOfSessionsCard />
      </section>

      <section className="mb-16">
        <Title title={`${name}님이 작성한 글 모음`} className="mb-[10px]" />
        <MyCollection />
      </section>

      <section>
        <h2 className="mb-[10px] bg-darkGreen px-2 py-[14px] text-lg font-semibold text-white">
          서비스가 궁금할 땐 FAQ
        </h2>

        <div className="flex justify-between">
          <ul className="mr-2 flex w-full flex-col gap-2">
            {faqList.map(faq => (
              <Faq key={faq.title} faq={faq} />
            ))}
          </ul>

          <img
            src={imgUrl}
            className="mb-auto w-2/5 object-contain"
            alt="FAQ"
          />
        </div>
      </section>
    </MainView>
  );
}
