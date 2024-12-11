import {
  initialUserProfile,
  useGetUserProfile,
} from '@/services/auth/authQueries';

import imgUrl from '@/assets/images/faq.png';
import { faqList } from '@/constants/faq';
import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';

import Title from '@/components/common/Title';
import ScrollContainer from '@/components/common/container/ScrollContainer';
import Faq from '@/components/faq/Faq';
import FavoritePostCard from '@/components/user/FavoritePostCard';
import PostAndCommentCollection from '@/components/user/PostAndCommentCollection';
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
      value: campusList.map(({ campusName }) => campusName).join(', '),
    },
    {
      label: '소속 교육과정',
      value: (
        <ul className="flex-1">
          {courseList.map(({ courseTitle }) => (
            <span key={courseTitle} className="mb-1 block">
              {courseTitle.length > 25
                ? `${courseTitle.slice(0, 25)}...`
                : courseTitle}
            </span>
          ))}
        </ul>
      ),
    },
  ];

  if (isLoading) return null;

  return (
    <MainView>
      <Header title="마이페이지" />

      <section className="mb-16 flex gap-4">
        <UserNameImageCard />

        <ul className="flex min-w-[25%] max-w-[500px] flex-col justify-between rounded-xl bg-vividGreen1 px-6 py-4">
          {userInfoList.map(({ value, label }) => (
            <li
              key={label}
              className="flex items-start justify-between py-2.5 text-end font-medium text-white"
            >
              <span className="mr-5 font-medium text-vividGreen3">
                {label}:
              </span>
              {value}
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-16">
        <Title title={`${name}님이 작성한 글 모음`} className="mb-[10px]" />
        <PostAndCommentCollection />
      </section>

      <section className="mb-16 w-full flex-1">
        <div className="mb-[10px] flex items-center justify-between">
          <Title title={`${name}님이 찜한 글 모음`} />
        </div>

        <ScrollContainer>
          {[1, 2, 3, 4, 5, 6].map(card => (
            <FavoritePostCard key={card} />
          ))}
        </ScrollContainer>
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
