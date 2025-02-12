import MainView from '@/layouts/MainView';

import LoopLoading from '@/components/common/LoopLoading';

/**
 * @param noLayout - <Layout />으로 감싸이지 않았을 때의 로딩 페이지
 */

interface LoadingPageProps {
  noLayout?: boolean;
}

export default function LoadingPage({ noLayout }: LoadingPageProps) {
  return (
    <MainView className="!p-0">
      <div
        className={`flex flex-col items-center justify-center bg-white shadow-card ${noLayout ? 'm-10 flex-1 rounded-[80px]' : 'mb-10 mt-[60px] size-full rounded-l-[80px]'}`}
      >
        <LoopLoading />
        <span className="mb-4 mt-10 text-[40px] font-semibold">
          잠시만 기다려주세요
        </span>
        {!noLayout && (
          <span className="text-lg font-medium text-darkGray-active">
            해당 페이지로 이동중입니다!
          </span>
        )}
      </div>
    </MainView>
  );
}
