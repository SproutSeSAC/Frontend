import { Link } from 'react-router-dom';

import {
  initialUserProfile,
  useGetUserProfile,
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
  const { data = initialUserProfile, isLoading } = useGetUserProfile();

  const { courseList, name, phoneNumber, campusList, email } = data;

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
            courseList.slice(0, 1).map(({ courseTitle }) => (
              <span
                className="w-full overflow-hidden truncate text-end"
                key={courseTitle}
              >
                {courseTitle}
              </span>
            ))
          ) : (
            <span className="w-full overflow-hidden truncate text-end">
              {courseList[0]?.courseTitle}
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

      <section className="mb-10 grid grid-cols-3 gap-x-9">
        <div className="col-span-2">
          <Title title="회원 정보 수정" className="mb-[14px]" />

          <div className="grid grid-cols-2 gap-x-9">
            <UserNameImageCard profile={data} />

            <ul className="relative flex h-[200px] flex-col justify-center gap-4 rounded-[20px] bg-white px-7 py-2 peer-hover:cursor-pointer">
              {userInfoList.map(({ value, label }) => (
                <li
                  key={label}
                  className={`relative flex w-full items-start justify-between ${label === '소속 교육과정' ? 'peer' : ''}`}
                >
                  <span className="mr-3 w-28 whitespace-nowrap text-darkGray-active">
                    {label}
                  </span>

                  {value}

                  {/*  교육과정 전체 목록  */}
                  {label === '소속 교육과정' && courseList.length > 1 && (
                    <div className="absolute -right-[50%] top-[100%] z-10 hidden rounded-[20px] bg-white px-8 pb-8 pt-6 shadow-card hover:block peer-hover:block">
                      <header className="flex items-center justify-between border-b border-mainGray pb-4 text-black">
                        <h4>소속 교육과정 전체 목록</h4>
                        <span>총 {courseList.length}개</span>
                      </header>

                      <ul className="mt-4 flex flex-col gap-y-4">
                        {courseList.map(({ courseTitle }, index) => (
                          <li
                            className="w-full overflow-hidden truncate tracking-tight text-black"
                            key={courseTitle}
                          >
                            <span className="inline-block w-8 text-darkGray">
                              {index + 1}.
                            </span>{' '}
                            {courseTitle}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
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

      <section className="mb-20 min-h-[350px]">
        <Title title={`${name}님이 작성한 글 모음`} />
        <MyCollection />
      </section>

      <section>
        <Title title=" 서비스가 궁금할 땐 FAQ" />

        <div className="mt-8 flex justify-between">
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
