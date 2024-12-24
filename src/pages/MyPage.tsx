import {
  initialUserProfile,
  useGetUserProfile,
} from '@/services/auth/authQueries';

import imgUrl from '@/assets/images/faq.png';
import { faqList } from '@/constants/faq';
import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';

import Title from '@/components/common/Title';
import Faq from '@/components/faq/Faq';
import ApplicationListOfSessionsCard from '@/components/mypage/ApplicationListOfSessionsCard';
import MyCollection from '@/components/mypage/MyCollection';
import UserNameImageCard from '@/components/user/UserNameImageCard';

export default function MyPage() {
  const { data: userProfile = initialUserProfile, isLoading } =
    useGetUserProfile();

  const { name, email, campusList, courseList } = userProfile;

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
        <ul>
          {courseList.map(({ courseTitle }) => (
            <li
              key={courseTitle}
              className="block max-w-60 overflow-hidden truncate"
            >
              {courseTitle}
            </li>
          ))}
        </ul>
      ),
    },
  ];

  if (isLoading) return null;

  return (
    <MainView>
      <Header title="마이페이지" />

      <section className="mb-16 grid grid-cols-[280px,430px,450px] gap-x-4">
        <UserNameImageCard />

        <ul className="flex flex-col justify-between rounded-xl bg-vividGreen1 px-6 py-4 shadow-card">
          {userInfoList.map(({ value, label }) => (
            <li
              key={label}
              className="borer-red-500 flex items-start justify-between py-2.5 font-medium text-white"
            >
              <span className="mr-3 whitespace-nowrap font-medium text-vividGreen3">
                {label}:
              </span>
              {value}
            </li>
          ))}
        </ul>

        <ApplicationListOfSessionsCard />
      </section>

      <section className="mb-16">
        <Title title={`${name}님이 작성한 글 모음`} className="mb-[10px]" />
        <MyCollection />
      </section>

      <section>
        <h2 className="mb-[10px] bg-vividGreen1 px-2 py-[14px] text-lg font-semibold text-white">
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
