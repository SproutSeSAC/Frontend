import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';
import dayGridPlugin from '@fullcalendar/daygrid';
import FullCalendar from '@fullcalendar/react';

export default function Schedule() {
  return (
    <MainView>
      <Header title="김철수 님의 이번달도 응원합니다!" highlight="김철수" />
      <div className="">
        <FullCalendar plugins={[dayGridPlugin]} initialView="dayGridMonth" />
      </div>
    </MainView>
  );
}
