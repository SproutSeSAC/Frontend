import { useCallback } from 'react';

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
  sideViewEvents?: FullCalendarEvent[];
  className?: string;
}

export default function Calendar({
  type,
  events,
  sideViewEvents,
  className = '',
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
          <span className="text-sm font-normal">{date}</span>

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

  return (
    <div
      className={`${type}-calendar w-full rounded-[20px] bg-white p-4 ${className}`}
    >
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
              `${year}년 ${month + 1}월`
            }
            headerToolbar={{ left: 'title', right: 'prev next' }}
            dayCellContent={info => renderDayCellContent(info, events)}
            eventDisplay="block"
            dayHeaderContent={info =>
              ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][info.date.getDay()]
            }
          />

          {sideViewEvents && sideViewEvents.length !== 0 ? (
            <ul className="flex w-full flex-col justify-center gap-4">
              {sideViewEvents.map(({ id, start, title }) => (
                <SmallCalendarBottomEvent
                  key={id}
                  date={new Date(start).toLocaleDateString()}
                  title={title}
                />
              ))}
            </ul>
          ) : (
            <span className="w-full pt-2 text-mainGray-active">
              일정이 없습니다.
            </span>
          )}
        </>
      )}
    </div>
  );
}
