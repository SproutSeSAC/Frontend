import { useCallback, useMemo } from 'react';

import '@/calendar.css';
import { FullCalendarEvent } from '@/types';
import { DayCellContentArg, EventSourceInput } from '@fullcalendar/core';
import koLocale from '@fullcalendar/core/locales/ko';
import dayGridPlugin from '@fullcalendar/daygrid';
import FullCalendar from '@fullcalendar/react';
import rrulePlugin from '@fullcalendar/rrule';

import SmallCalendarBottomEvent from '@/components/schedule/SmallCalendarBottomEvent';

interface CalendarProps {
  type: 'big' | 'small';
  events?: FullCalendarEvent[];
  courseEvents?: FullCalendarEvent[];
}

export default function Calendar({
  type,
  events,
  courseEvents,
}: CalendarProps) {
  const renderDayCellContent = useCallback(
    (info: DayCellContentArg, cellEvents?: FullCalendarEvent[]) => {
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
            <ul className="absolute -bottom-[1px] flex w-full items-center justify-center gap-0.5">
              {eventDots
                ?.slice(0, 3)
                ?.map(({ id, backgroundColor }) => (
                  <li
                    key={id}
                    style={{ backgroundColor }}
                    className="size-[5px] rounded-full"
                  />
                ))}
            </ul>
          )}
        </div>
      );
    },
    [],
  );

  const futureEvents = useMemo(() => {
    const today = new Date();
    today.setDate(today.getDate() - 1);

    return courseEvents?.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate >= today;
    });
  }, [courseEvents]);

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
            dayCellContent={info => renderDayCellContent(info, events)}
            eventDisplay="block"
          />
          {futureEvents && futureEvents.length !== 0 && (
            <ul className="mb-2 mt-1 flex flex-col gap-2">
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
