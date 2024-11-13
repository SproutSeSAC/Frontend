import { useMemo } from 'react';

import '@/calendar.css';
import { FullCalendarEvent } from '@/types';
import { EventSourceInput } from '@fullcalendar/core';
import koLocale from '@fullcalendar/core/locales/ko';
import dayGridPlugin from '@fullcalendar/daygrid';
import FullCalendar from '@fullcalendar/react';
import rrulePlugin from '@fullcalendar/rrule';

import SmallCalendarBottomEvent from '@/components/schedule/SmallCalendarBottomEvent';

interface CalendarProps {
  type: 'big' | 'small';
  events?: FullCalendarEvent[];
}

export default function Calendar({ type, events }: CalendarProps) {
  const futureEvents = useMemo(() => {
    const today = new Date();
    today.setDate(today.getDate() - 1);
    return events?.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate >= today;
    });
  }, [events]);

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
          {futureEvents && futureEvents.length !== 0 && (
            <ul className="mb-2 mt-3 flex flex-col gap-2">
              {futureEvents.slice(0, 4).map(event => (
                <SmallCalendarBottomEvent
                  key={event.title}
                  date={new Date(event.start).toLocaleDateString()}
                  title={event.title}
                />
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
