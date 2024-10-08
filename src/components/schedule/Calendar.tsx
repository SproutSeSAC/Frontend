import '@/calendar.css';
import koLocale from '@fullcalendar/core/locales/ko';
import dayGridPlugin from '@fullcalendar/daygrid';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import FullCalendar from '@fullcalendar/react';
import { FaPlus } from 'react-icons/fa6';
import { FiCalendar } from 'react-icons/fi';

import SquareButton from '@/components/common/button/SquareButton';
import Checkbox from '@/components/common/checkbox/Checkbox';

interface CalendarProps {
  events?: {
    title: string;
    start: string;
    end: string;
    id: string;
  }[];
}

const subscribeCalendarList = [
  '캠퍼스 매니저의 새싹 캘린더',
  '교육 매니저의 새싹 캘린더',
];

export default function Calendar({ events }: CalendarProps) {
  return (
    <div className="flex h-full gap-4">
      <div className="flex w-80 flex-col gap-4">
        <div className="small-calendar my-0 p-3">
          <FullCalendar
            weekends
            height="auto"
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            timeZone="Asia/Seoul"
            locale="en"
            locales={[koLocale]}
            titleFormat={({ date: { year, month } }) =>
              `${month + 1}월 ${year}년`
            }
            headerToolbar={{
              left: 'title',
              right: 'prev,next',
            }}
            dayHeaderContent={date => date.text.slice(0, 2)}
            // events={events}
          />
        </div>

        <div className="h-full rounded-xl bg-white p-5 shadow-card">
          <h2 className="mb-2 flex items-center gap-1 text-[15px] text-gray2">
            <FiCalendar />
            구독 캘린더
          </h2>
          <ul className="mb-10 flex flex-col gap-2">
            {subscribeCalendarList.map(calendar => (
              <Checkbox
                key={calendar}
                id={calendar}
                text={calendar}
                checked={false}
                onChange={() => {}}
              />
            ))}
          </ul>

          <h2 className="mb-2 flex items-center gap-1 text-[15px] text-gray2">
            <FiCalendar />
            나의 캘린더
          </h2>
          <ul className="flex flex-col gap-2">
            {['Sprout', '전예림'].map(calendar => (
              <Checkbox
                key={calendar}
                id={calendar}
                text={calendar}
                checked={false}
                onChange={() => {}}
              />
            ))}
          </ul>
        </div>

        <ul className="flex flex-col gap-3">
          {subscribeCalendarList.map(calendar => (
            <SquareButton
              key={calendar}
              name={`${calendar} 구독`}
              className="flex items-center gap-1 py-3 text-sm font-semibold shadow-[15px]"
            >
              <FaPlus className="text-sm" />
            </SquareButton>
          ))}
        </ul>
      </div>

      <div className="big-calendar w-full rounded-xl bg-white shadow-card">
        <FullCalendar
          weekends
          plugins={[dayGridPlugin, googleCalendarPlugin]}
          initialView="dayGridMonth"
          timeZone="Asia/Seoul"
          locale="ko"
          locales={[koLocale]}
          events={events}
          headerToolbar={{
            left: 'title',
            right: 'prev today next',
          }}
          dayCellContent={({ dayNumberText }) => {
            return `${dayNumberText.slice(0, -1)}`;
          }}
          height="100%"
        />
      </div>
    </div>
  );
}
