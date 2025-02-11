import { useMemo } from 'react';

import { calendarIdsAtom } from '@/atoms/calendarAtom';

import { Calendar, CalendarListByCategory, RoleKey } from '@/types';
import { isTrainee } from '@/utils';
import { useAtom } from 'jotai';

import Accordion from '@/components/common/Accordion';
import Checkbox from '@/components/common/checkbox/Checkbox';
import AclInfoButton from '@/components/schedule/AclInfoButton';
import CreateCalendarButton from '@/components/schedule/CreateCalendarButton';
import SubscribeCalendarButton from '@/components/schedule/SubscribeCalendarButton';

interface CalendarCheckBoxListProps {
  userRole: RoleKey;
  allCourseCalendarList: Calendar[];
  personalCalendarList: Calendar[];
}

export default function CalendarCheckBoxList({
  userRole,
  allCourseCalendarList,
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
        calendarList: allCourseCalendarList,
      },
      {
        category: '개인 캘린더',
        calendarList: personalCalendarList, //
      },
    ],
    [allCourseCalendarList, personalCalendarList],
  );

  return (
    <ul className="flex-1 overflow-auto rounded-[20px] bg-white px-5 pt-5 scrollbar-hide">
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
              calendarList?.map(
                ({
                  accessRole,
                  courseId,
                  courseTitle,
                  id,
                  backgroundColor,
                  summary,
                  calendarId,
                }) => (
                  <div
                    key={courseId}
                    className="flex items-start justify-between [&>label]:items-start"
                  >
                    {/* 캘린더가 생성된 경우 */}
                    {summary ? (
                      <>
                        <Checkbox
                          id={courseId}
                          text={summary || courseTitle}
                          checked={!!currentCalendarIds?.includes(id)}
                          onChange={() => onCheckBoxChange(id)}
                          textClassName="!text-black"
                          checkBoxColor={backgroundColor}
                        />
                        {!isTrainee(userRole) && (
                          <AclInfoButton
                            courseId={courseId}
                            accessRole={accessRole}
                          />
                        )}
                      </>
                    ) : (
                      <>
                        {isTrainee(userRole) && (
                          <SubscribeCalendarButton
                            courseTitle={courseTitle}
                            courseId={courseId}
                            disabled={!!calendarId}
                          />
                        )}
                        {!isTrainee(userRole) && (
                          <CreateCalendarButton
                            courseTitle={courseTitle}
                            courseId={courseId}
                            userRole={userRole}
                            disabled={!!calendarId}
                          />
                        )}
                      </>
                    )}
                  </div>
                ),
              )}

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
