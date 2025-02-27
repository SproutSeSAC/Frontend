import { useMemo } from 'react';

import { Link } from 'react-router-dom';

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
    profile: { name, phoneNumber },
    study: { course: courseList, campus: campusList, email },
  } = userProfileCard;

  const sortedCourseList = useMemo(() => {
    return courseList.length === 1
      ? courseList
      : courseList.sort((a, b) => (a.courseName > b.courseName ? 1 : -1));
  }, [courseList]);

  const userInfoList = [
    {
      label: 'Email',
      value: <span>{email}</span>,
    },
    {
      label: '소속 캠퍼스',
      value: (
        <span className="truncate">
          {campusList
            .map(({ campusName }) => campusName.slice(0, 2))
            .join(', ')}{' '}
          캠퍼스
        </span>
      ),
    },
    {
      label: '소속 교육과정',
      value: (
        <div className="peer flex w-full flex-1 items-center truncate">
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
    {
      label: '전화번호',
      value: phoneNumber,
    },
  ];

  if (isLoading) return null;

  return (
    <MainView>
      <Header title="마이페이지" />

      <section className="mb-14 grid grid-cols-3 gap-x-8">
        <div className="col-span-2">
          <Title title="회원 정보 수정" className="mb-3" />

          <div className="grid grid-cols-2 gap-x-8">
            <UserNameImageCard data={userProfileCard.profile} />
            <ul className="relative flex h-[172px] flex-col justify-center gap-3 rounded-[20px] bg-white px-6 py-2 peer-hover:cursor-pointer">
              {userInfoList.map(({ value, label }) => (
                <li
                  key={label}
                  className={`flex w-full items-start justify-between ${label === '소속 교육과정' ? 'peer' : ''}`}
                >
                  <span className="mr-3 w-28 whitespace-nowrap text-darkGray-active">
                    {label}
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
          </div>
        </div>

        <div className="col-span-1">
          <div className="mb-3 flex items-center justify-between">
            <Title title="특강 / 행사 신청 내역" />
            <Link
              to="/application-status-for-sessions"
              className="text-sm font-medium text-darkGray"
            >
              더보기
            </Link>
          </div>
          <ApplicationListOfSessionsCard />
        </div>
      </section>

      <section className="mb-14">
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
