import { useCalendarData } from '@/hooks';
import { RoleValues } from '@/types';
import { getColorByRole } from '@/utils';

import Tag from '@/components/common/Tag';
import Title from '@/components/common/Title';
import Calendar from '@/components/schedule/Calendar';
import SmallCalendarBottomEvent from '@/components/schedule/SmallCalendarBottomEvent';

export default function AnnouncementSideView() {
  const { fullCalendarEvents } = useCalendarData();

  return (
    <>
      <Title title="주요일정" className="mb-2" />
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

      <div className="mb-2 mt-8 flex items-center justify-between">
        <Title title="최근 본 공지사항" className="!pl-0 text-sm" />
      </div>

      <ul className="flex flex-col gap-2">
        {(['캠퍼스 매니저', '잡코디', '교육 매니저'] as RoleValues[]).map(
          item => (
            <li key={item} className="flex h-7 w-full items-center gap-1.5">
              <Tag
                size="big"
                color={getColorByRole(item)}
                text={item}
                className="!p-0 font-medium"
                emphasisText
              />
              <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
                1세대에게 직접 배우는 안드로이드 앱
              </span>
            </li>
          ),
        )}
      </ul>
    </>
  );
}
