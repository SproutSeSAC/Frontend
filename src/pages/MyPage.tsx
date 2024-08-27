import { faqList } from '@/dummy/faq';
import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';

import Faq from '@/components/faq/Faq';

export default function MyPage() {
  return (
    <MainView>
      <Header title="회원 정보 수정" />
      <section>
        <h2 className="mb-[10px] text-lg font-semibold">
          김철수님이 작성한 글 모음
        </h2>
      </section>

      <section>
        <h2 className="mb-[10px] text-lg font-semibold">
          김철수님이 찜한 글 모음
        </h2>
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
