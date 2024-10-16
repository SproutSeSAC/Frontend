import { useCalendarData } from '@/hooks';

import Tag from '@/components/common/Tag';
import Title from '@/components/common/Title';
import Calendar from '@/components/schedule/Calendar';
import SmallCalendarBottomEvent from '@/components/schedule/SmallCalendarBottomEvent';

export default function AnnouncementSideView() {
  const { fullCalendarEvents } = useCalendarData();

  return (
    <>
      <Title title="주요일정" />
      <Calendar type="small" events={fullCalendarEvents}>
        <ul className="mb-1 flex flex-col gap-2">
          {fullCalendarEvents.map(event => (
            <SmallCalendarBottomEvent
              key={event.title}
              date={new Date(event.start).toLocaleDateString()}
              title={event.title}
            />
          ))}
        </ul>
      </Calendar>

      <div className="mb-2 flex items-center justify-between">
        <Title title="최근 본 공지사항" className="!pl-0 text-sm" />
      </div>

      <ul className="flex flex-col gap-2">
        {[1, 2, 3, 4, 5].map(item => (
          <li key={item} className="flex h-7 w-full gap-1.5">
            <Tag
              size="small"
              color="green"
              text="엑스퍼트"
              className="h-6 !px-1 font-semibold"
            />
            <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
              1세대에게 직접 배우는 안드로이드 앱
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}
