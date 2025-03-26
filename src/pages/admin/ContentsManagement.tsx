import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';

import PreparingPage from '@/components/common/PreparingPage';

export default function ContentsManagement() {
  return (
    <MainView>
      <Header title="콘텐츠 관리" />
      <PreparingPage />
    </MainView>
  );
}
