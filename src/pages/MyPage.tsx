import { useMemo } from 'react';

import {
  initialUserProfile,
  useGetUserProfile,
} from '@/services/auth/authQueries';

import imgUrl from '@/assets/images/faq.png';
import { faqList } from '@/constants/faq';
import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';
import { FiChevronDown } from 'react-icons/fi';

import Title from '@/components/common/Title';
import Faq from '@/components/faq/Faq';
import ApplicationListOfSessionsCard from '@/components/mypage/ApplicationListOfSessionsCard';
import MyCollection from '@/components/mypage/MyCollection';
import UserNameImageCard from '@/components/user/UserNameImageCard';

export default function MyPage() {
  const { data: userProfile = initialUserProfile, isLoading } =
    useGetUserProfile();

  const { name, email, campusList, courseList } = userProfile;

  const sortedCourseList = useMemo(() => {
    return courseList.sort((a, b) => (a.courseTitle > b.courseTitle ? 1 : -1));
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
            sortedCourseList.slice(0, 1).map(({ courseTitle }) => (
              <span
                className="w-full overflow-hidden truncate text-end"
                key={courseTitle}
              >
                {courseTitle}
              </span>
            ))
          ) : (
            <span className="w-full overflow-hidden truncate text-end">
              {courseList[0].courseTitle}
            </span>
          )}
          {courseList.length > 1 && <FiChevronDown className="size-5" />}
        </div>
      ),
    },
  ];

  if (isLoading) return null;

  return (
    <MainView>
      <Header title="마이페이지" />

      <section className="mb-16 flex gap-x-4 [&>*:first-child]:w-[280px] [&>*:last-child]:w-[30vw] [&>*:last-child]:lg:w-[300px]">
        <UserNameImageCard />

        <div className="relative">
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

            {courseList.length > 1 && (
              <div className="absolute right-5 top-40 hidden rounded-xl bg-white p-5 shadow-card hover:block peer-hover:block">
                <header className="flex items-center justify-between border-b border-mainGray pb-2 text-black">
                  <h4>교육과정 전체 목록</h4>
                  <span>총 {courseList.length}개</span>
                </header>

                <ul className="mt-3 flex flex-col gap-y-3">
                  {sortedCourseList.map(({ courseTitle }, index) => (
                    <li
                      className="w-full overflow-hidden truncate text-black"
                      key={courseTitle}
                    >
                      {index + 1}. {courseTitle}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </ul>
        </div>

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
            alt="faq 관련 이미지"
          />
        </div>
      </section>
    </MainView>
  );
}
