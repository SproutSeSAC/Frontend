import { Link } from 'react-router-dom';

import { faqList } from '@/dummy/faq';
import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';
import { BsCameraFill, BsPerson } from 'react-icons/bs';

import Title from '@/components/common/Title';
import EditButton from '@/components/common/button/EditButton';
import Faq from '@/components/faq/Faq';
import FavoritePostCard from '@/components/user/FavoritePostCard';
import PostAndCommentCollection from '@/components/user/PostAndCommentCollection';

export default function MyPage() {
  const userInfoList = [
    { label: 'E-mail', value: 'dashboard@gmail.com' },
    { label: '캠퍼스', value: '도봉 캠퍼스' },
    { label: '담당 교육과정', value: '데이터 드리븐 기획자 과정' },
  ];
  return (
    <MainView>
      <Header title="회원 정보 수정" />
      <section className="mb-16 flex gap-4">
        <div className="relative flex w-[45%] max-w-[305px] items-center gap-8 rounded-xl bg-oliveGreen1 px-6 py-10">
          <div className="relative flex size-24 items-center justify-center rounded-full bg-white">
            <BsPerson className="size-10 text-gray1" />

            <button
              type="button"
              aria-label="프로필 이미지 수정하기"
              className="absolute bottom-0 right-0 flex size-7 items-center justify-center rounded-full bg-vividGreen1 p-1"
            >
              <BsCameraFill className="size-4 text-white" />
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-2xl font-medium text-white">김철수</span>
            <span className="text-oliveGreen3">@새싹 김철수</span>
          </div>

          <EditButton
            label="프로필 수정 버튼"
            className="absolute right-3 top-3 text-white"
          />
        </div>

        <ul className="flex w-[55%] max-w-[405px] flex-col justify-between rounded-xl bg-vividGreen1 px-6 py-4">
          {userInfoList.map(info => (
            <li
              key={info.label}
              className="flex items-center justify-between py-2.5"
            >
              <span className="font-medium text-vividGreen3">
                {info.label}:{' '}
              </span>
              <span className="font-medium text-white">{info.value}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-16">
        <Title title="김철수님이 작성한 글 모음" />
        <PostAndCommentCollection />
      </section>

      <section className="mb-16 w-full flex-1">
        <div className="flex items-center justify-between border">
          <Title title="김철수님이 찜한 글 모음" />
          <Link
            to="/lounge"
            className="text-sm font-semibold tracking-tight text-gray1"
          >
            전체보기
          </Link>
        </div>
        <div className="overflow-x-scroll scrollbar-hide">
          <ul className="flex max-w-0 flex-1 gap-6">
            {[1, 2, 3, 4, 5, 6].map(card => (
              <FavoritePostCard key={card} />
            ))}
          </ul>
        </div>
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
            src="src/assets/images/faq.png"
            className="mb-auto w-2/5 object-contain"
            alt="faq 관련 이미지"
          />
        </div>
      </section>
    </MainView>
  );
}
