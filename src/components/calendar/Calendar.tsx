import { useCallback } from 'react';

import { useNavigate } from 'react-router-dom';

import '@/calendar.css';
import { FullCalendarEvent } from '@/types';
import { formatDate } from '@/utils';
import { DayCellContentArg, EventSourceInput } from '@fullcalendar/core';
import koLocale from '@fullcalendar/core/locales/ko';
import dayGridPlugin from '@fullcalendar/daygrid';
import FullCalendar from '@fullcalendar/react';
import rrulePlugin from '@fullcalendar/rrule';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

import SmallCalendarBottomEvent from '@/components/calendar/SmallCalendarBottomEvent';
import LoopLoading from '@/components/common/LoopLoading';

interface CalendarProps {
  type: 'big' | 'small';
  events?: FullCalendarEvent[];
  sideViewEvents?: FullCalendarEvent[];
  className?: string;
  isCourseCalendarLoadingArr?: boolean[];
}

export default function Calendar({
  type,
  events,
  sideViewEvents,
  className = '',
  isCourseCalendarLoadingArr,
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
            <ul className="absolute -bottom-1 flex w-full items-center justify-center gap-[3px]">
              {eventDots
                ?.slice(0, 3)
                ?.map(({ id, backgroundColor }) => (
                  <li
                    key={id}
                    style={{ backgroundColor }}
                    className="size-[6px] rounded-full"
                  />
                ))}
            </ul>
          )}
        </div>
      );
    },
    [],
  );

  const navigate = useNavigate();

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
          eventMouseEnter={({ el, event }) => {
            tippy(el, {
              content: event.title,
              placement: 'top',
            });
          }}
          eventClick={event => {
            event.jsEvent.preventDefault();
            navigate(event.event.url);
          }}
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

          {!isCourseCalendarLoadingArr?.includes(true) &&
            sideViewEvents &&
            ((sideViewEvents as FullCalendarEvent[]).length !== 0 ? (
              <ul className="flex w-full flex-col justify-center gap-2 px-2 pt-2">
                {(sideViewEvents as FullCalendarEvent[]).map(
                  ({ id, start, end, title, url }) =>
                    url && (
                      <SmallCalendarBottomEvent
                        key={id}
                        date={formatDate(start, 'MM.dd')}
                        time={`${formatDate(start, 'HH:mm')} ~ ${formatDate(end, 'HH:mm')}`}
                        title={title}
                        to={url}
                      />
                    ),
                )}
              </ul>
            ) : (
              <span className="flex items-center justify-center py-14 text-mainGray-hover">
                일정이 없어요.
              </span>
            ))}

          {isCourseCalendarLoadingArr?.includes(true) && (
            <div className="flex min-h-[120px] items-center justify-center rounded-xl bg-white px-6 py-4">
              <LoopLoading size={80} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
