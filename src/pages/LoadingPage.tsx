import MainView from '@/layouts/MainView';

import LoopLoading from '@/components/common/LoopLoading';

export default function LoadingPage() {
  return (
    <MainView isEmpty>
      <LoopLoading />
      <span className="mb-4 mt-10 text-[40px] font-semibold">
        잠시만 기다려주세요
      </span>
      <span className="text-lg font-medium text-darkGray-active">
        해당 페이지로 이동중입니다!
      </span>
    </MainView>
  );
}
