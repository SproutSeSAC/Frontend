import { Link } from 'react-router-dom';

import { useGetUserProfile } from '@/services/auth/authQueries';

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
  const { data } = useGetUserProfile();

  const userInfoList = [
    { label: 'E-mail', value: 'dashboard@gmail.com' },
    { label: '캠퍼스', value: '도봉 캠퍼스' },
    { label: '담당 교육과정', value: '데이터 드리븐 기획자 과정' },
  ];

  return (
    <MainView>
      <Header title="회원 정보 수정" />

      <section className="mb-16 flex gap-4">
        {data && (
          <UserNameImageCard
            name={data.name}
            nickname={data.nickname}
            profileImageUrl={data.profileImageUrl}
          />
        )}

        <ul className="flex w-[55%] max-w-[405px] flex-col justify-between rounded-xl bg-vividGreen1 px-6 py-4">
          {userInfoList.map(({ value, label }) => (
            <li
              key={label}
              className="flex items-center justify-between py-2.5"
            >
              <span className="font-medium text-vividGreen3">{label}: </span>
              <span className="font-medium text-white">{value}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-16">
        <Title title="김철수님이 작성한 글 모음" className="mb-[10px]" />
        <PostAndCommentCollection />
      </section>

      <section className="mb-16 w-full flex-1">
        <div className="mb-[10px] flex items-center justify-between">
          <Title title="김철수님이 찜한 글 모음" />
          <Link
            to="/lounge"
            className="text-sm font-semibold tracking-tight text-gray1"
          >
            전체보기
          </Link>
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
          <ul className="mr-2 w-full">
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
