import { ReactNode, useCallback } from 'react';

import '@/calendar.css';
import { DayCellContentArg } from '@fullcalendar/core';
import koLocale from '@fullcalendar/core/locales/ko';
import dayGridPlugin from '@fullcalendar/daygrid';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import FullCalendar from '@fullcalendar/react';

type Event = {
  allDay: boolean;
  backgroundColor: string;
  title: string;
  start: string;
  end: string;
  id: string;
};

interface CalendarProps {
  type: 'big' | 'small';
  events?: Event[];
  children?: ReactNode;
}

export default function Calendar({ type, events, children }: CalendarProps) {
  const renderDayCellContent = useCallback(
    (info: DayCellContentArg, cellEvents?: Event[]) => {
      const date = info.date.getDate();

      const dateHours = info.date.setHours(0, 0, 0, 0);

      const eventDots = cellEvents?.filter(event => {
        const start = new Date(event.start).setHours(0, 0, 0, 0);
        const end = new Date(event.end).setHours(0, 0, 0, 0);

        const isAllDayEvent = event.allDay || start !== end;
        return (
          dateHours >= start &&
          (isAllDayEvent ? dateHours < end : dateHours <= end)
        );
      });

      return (
        <div className="relative flex h-8 w-full flex-col items-center justify-center px-2">
          <span>{date}</span>

          {eventDots?.length !== 0 && (
            <ul className="absolute -bottom-0 flex w-full items-center justify-center gap-0.5">
              {eventDots
                ?.slice(0, 3)
                ?.map(({ id, backgroundColor }) => (
                  <li
                    key={id}
                    style={{ backgroundColor }}
                    className="size-1 rounded-full"
                  />
                ))}
            </ul>
          )}
        </div>
      );
    },
    [],
  );

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
            dayCellContent={info => renderDayCellContent(info, events)}
            eventDisplay="block" // 시간 이벤트도 block 형태로 표시
            // eventTimeFormat={{
            // 시간 숨기기
            // hour: 'numeric',
            // minute: '2-digit',
            // meridiem: false,
            // }}
          />
          {children}
        </>
      )}
    </div>
  );
}
