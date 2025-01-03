import { EventWithId } from '@/types';
import { createRrule } from '@/utils';

export const changeFullCalendarEvents = (eventList: EventWithId[]) => {
  const recurringEvents = eventList
    .filter(event => event?.recurringEventId)
    .map(event => ({
      recurringEventId: event.recurringEventId,
      start: event?.start?.dateTime || event?.start?.date,
    }));

  return eventList
    ?.map(event => {
      const start = event?.start?.dateTime || event?.start?.date;
      const end = event?.end?.dateTime || event?.end?.date;

      const defaultEvent = {
        title: event?.summary ?? '제목없음',
        start,
        end,
        id: event?.id,
        backgroundColor: event?.backgroundColor,
        allDay: !event?.start?.dateTime && !event?.end?.dateTime,
        calendarId: event?.calendarId,
      };

      const exdate = recurringEvents
        .filter(({ recurringEventId }) => recurringEventId === event.id)
        .map(item => item.start);

      return event?.recurrence
        ? {
            ...defaultEvent,
            rrule: {
              ...createRrule(event.recurrence[0]),
              dtstart: start,
            },
            exdate,
          }
        : defaultEvent;
    })
    ?.sort((a, b) => a.start.localeCompare(b.start));
};
