import { Link } from 'react-router-dom';

import {
  initialUserProfile,
  useGetUserProfile,
} from '@/services/auth/authQueries';

import imgUrl from '@/assets/images/faq.png';
import { faqList } from '@/constants';
import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';

import Title from '@/components/common/Title';
import Faq from '@/components/faq/Faq';
import MyCollection from '@/components/mypage/MyCollection';
import MyPageAppliedSessionCard from '@/components/mypage/MyPageAppliedSessionCard';
import MyUserNameImageCard from '@/components/user/MyUserNameImageCard';

export default function MyPage() {
  const { data: { name } = initialUserProfile, isLoading } =
    useGetUserProfile();

  if (isLoading) return null;

  return (
    <MainView>
      <Header title="마이페이지" />

      <section className="mb-10 grid grid-cols-3 gap-x-9">
        <div className="col-span-2">
          <Title title="회원 정보 수정" className="mb-[14px]" />
          <MyUserNameImageCard />
        </div>

        <div className="col-span-1">
          <div className="mb-3 flex items-center justify-between">
            <Title title="특강 / 행사 신청 내역" />
            <Link
              to="/session-status"
              className="text-sm font-medium text-darkGray"
            >
              더보기
            </Link>
          </div>
          <MyPageAppliedSessionCard />
        </div>
      </section>

      <section className="mb-20 min-h-[420px]">
        <Title title={`${name}님이 작성한 글 모음`} className="mb-4" />
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
