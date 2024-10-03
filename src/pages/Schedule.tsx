import { getCalendar } from '@/services/auth/authQueries';

import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';

export default function Schedule() {
  const onClick = async () => {
    try {
      await getCalendar();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <MainView>
      <Header title="김철수 스프님 새싹 일정" highlight="새싹" />
      <div className="">
        일정관리페이지
        <button onClick={onClick}>캘린더 불러오기</button>
      </div>
    </MainView>
  );
}
