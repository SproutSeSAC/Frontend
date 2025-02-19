import { useMemo } from 'react';

import { calendarIdsAtom } from '@/atoms/calendarAtom';

import { Calendar, CalendarListByCategory, RoleKey } from '@/types';
import { hasAdmin, isSuperAdmin } from '@/utils';
import { useAtom } from 'jotai';

import AclInfoButton from '@/components/calendar/AclInfoButton';
import Accordion from '@/components/common/Accordion';
import Checkbox from '@/components/common/checkbox/Checkbox';

interface CalendarCheckBoxListProps {
  userRole: RoleKey;
  courseCalendarList: Calendar[];
  personalCalendarList: Calendar[];
}

export default function CalendarCheckBoxList({
  userRole,
  courseCalendarList,
  personalCalendarList,
}: CalendarCheckBoxListProps) {
  const [currentCalendarIds, setCurrentCalendarIds] = useAtom(calendarIdsAtom);

  const onCheckBoxChange = (id: string) => {
    if (currentCalendarIds?.includes(id)) {
      const filteredIds = currentCalendarIds.filter(
        currentId => currentId !== id,
      );
      setCurrentCalendarIds(filteredIds);
    } else {
      const ids = currentCalendarIds?.length
        ? [...currentCalendarIds, id]
        : [id];
      setCurrentCalendarIds(ids);
    }
  };

  const calendarListByCategory: CalendarListByCategory[] = useMemo(
    () => [
      {
        category: '교육과정 캘린더',
        calendarList: courseCalendarList,
      },
      {
        category: '개인 캘린더',
        calendarList: personalCalendarList,
      },
    ],
    [courseCalendarList, personalCalendarList],
  );

  return (
    <ul className="w-[45%] max-w-[350px] overflow-auto rounded-[20px] bg-white px-5 pt-5 scrollbar-hide">
      {calendarListByCategory.map(({ category, calendarList }) => (
        <Accordion
          key={category}
          title={category}
          className="mb-6"
          titleClassName="text-mainGreen text-sm text-darkGray-active mb-3 [&>button>svg]:text-xs [&>button>svg]:text-darkGray-active"
          initialOpen
        >
          <ul className="flex flex-col gap-2">
            {category === '교육과정 캘린더' &&
              calendarList?.map(calendar => (
                <div
                  key={calendar.courseId}
                  className="flex items-start justify-between [&>label]:items-start"
                >
                  <Checkbox
                    id={calendar.courseId}
                    text={calendar.summary || calendar.courseTitle}
                    checked={!!currentCalendarIds?.includes(calendar.id)}
                    onChange={() => onCheckBoxChange(calendar.id)}
                    textClassName={
                      calendar.summary ? '!text-black' : '!text-mainGray-active'
                    }
                    checkBoxColor={calendar.backgroundColor}
                    disabled={!calendar.summary}
                  />
                  {hasAdmin(userRole) && !isSuperAdmin(userRole) && (
                    <AclInfoButton
                      courseId={calendar.courseId}
                      accessRole={calendar.accessRole}
                    />
                  )}
                </div>
              ))}

            {category === '개인 캘린더' &&
              calendarList?.map(({ id, summary, backgroundColor, primary }) => (
                <Checkbox
                  key={id}
                  id={id}
                  text={primary ? '기본 캘린더' : summary}
                  checked={!!currentCalendarIds?.includes(id)}
                  onChange={() => onCheckBoxChange(id)}
                  textClassName="!text-black"
                  checkBoxColor={backgroundColor}
                />
              ))}
          </ul>
        </Accordion>
      ))}
    </ul>
  );
}
