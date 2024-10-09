import { ReactNode } from 'react';

import '@/calendar.css';
import koLocale from '@fullcalendar/core/locales/ko';
import dayGridPlugin from '@fullcalendar/daygrid';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import FullCalendar from '@fullcalendar/react';

interface CalendarProps {
  type: 'big' | 'small';
  events?: {
    title: string;
    start: string;
    end: string;
    id: string;
  }[];
  children?: ReactNode;
}

export default function Calendar({ type, events, children }: CalendarProps) {
  return (
    <div className={`${type}-calendar w-full rounded-xl bg-white shadow-card`}>
      {type === 'big' ? (
        <FullCalendar
          weekends
          initialView="dayGridMonth"
          timeZone="Asia/Seoul"
          plugins={[dayGridPlugin, googleCalendarPlugin]}
          locales={[koLocale]}
          events={events}
          height="100%"
          locale="ko"
          headerToolbar={{
            left: 'title',
            right: 'prev today next',
          }}
          dayCellContent={({ dayNumberText }) =>
            `${dayNumberText.slice(0, -1)}`
          }
        />
      ) : (
        <>
          <FullCalendar
            weekends
            height="auto"
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            timeZone="Asia/Seoul"
            events={events}
            locales={[koLocale]}
            locale="en"
            titleFormat={({ date: { year, month } }) =>
              `${month + 1}월 ${year}년`
            }
            headerToolbar={{
              left: 'title',
              right: 'prev next',
            }}
            dayHeaderContent={date => date.text.slice(0, 2)}
          />
          {children}
        </>
      )}
    </div>
  );
}
