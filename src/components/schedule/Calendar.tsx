import { ReactNode } from 'react';

import '@/calendar.css';
import { FullCalendarEvent } from '@/types';
import { EventSourceInput } from '@fullcalendar/core';
import koLocale from '@fullcalendar/core/locales/ko';
import dayGridPlugin from '@fullcalendar/daygrid';
import FullCalendar from '@fullcalendar/react';
import rrulePlugin from '@fullcalendar/rrule';

interface CalendarProps {
  type: 'big' | 'small';
  events?: FullCalendarEvent[];
  children?: ReactNode;
}

export default function Calendar({ type, events, children }: CalendarProps) {
  return (
    <div className={`${type}-calendar w-full rounded-xl bg-white shadow-card`}>
      {type === 'big' ? (
        <FullCalendar
          weekends
          initialView="dayGridMonth"
          plugins={[dayGridPlugin, rrulePlugin]}
          events={events as EventSourceInput}
          locales={[koLocale]}
          height="100%"
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
            initialView="dayGridMonth"
            plugins={[dayGridPlugin, rrulePlugin]}
            events={events as EventSourceInput}
            locales={[koLocale]}
            height="auto"
            titleFormat={({ date: { year, month } }) =>
              `${month + 1}월 ${year}년`
            }
            headerToolbar={{
              left: 'title',
              right: 'prev next',
            }}
            dayCellContent={({ dayNumberText }) =>
              `${dayNumberText.slice(0, -1)}`
            }
            eventDisplay="block"
          />
          {children}
        </>
      )}
    </div>
  );
}
