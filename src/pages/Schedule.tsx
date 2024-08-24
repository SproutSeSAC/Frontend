import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';

export default function Schedule() {
  return (
    <MainView>
      <Header title="김철수 님의 이번달도 응원합니다!" highlight="김철수" />
      <div className="">일정관리페이지</div>
    </MainView>
  );
}