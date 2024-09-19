import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';
import dayGridPlugin from '@fullcalendar/daygrid';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import FullCalendar from '@fullcalendar/react';

export default function Schedule() {
  return (
    <MainView>
      <Header title="김철수 님의 이번달도 응원합니다!" highlight="김철수" />
      <div className="mt-0">
        <FullCalendar
          weekends // 주말 여부
          plugins={[dayGridPlugin, googleCalendarPlugin]}
          initialView="dayGridMonth"
          googleCalendarApiKey={import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY}
          events={{
            googleCalendarId:
              '20bcee909ae83242e1fe00f9d7220d78a2da5beb4d4892c84ee1907e4f640030@group.calendar.google.com',
          }}
          timeZone="Asia/Seoul"
          locale="ko"
          headerToolbar={{
            left: 'today',
            center: 'title',
            right: 'prev,next',
          }}
        />
      </div>
    </MainView>
  );
}
