import { useMemo } from 'react';

import { calendarIdsAtom } from '@/atoms/calendarAtom';

import { Calendar, CalendarListByCategory, KeyOfRole } from '@/types';
import { isManagerAndAdmin, isPreTrainee, isTrainee } from '@/utils';
import { useAtom } from 'jotai';

import Accordion from '@/components/common/Accordion';
import Checkbox from '@/components/common/checkbox/Checkbox';
import AclInfoButton from '@/components/schedule/AclInfoButton';
import CreateCalendarButton from '@/components/schedule/CreateCalendarButton';
import SubscribeCalendarButton from '@/components/schedule/SubscribeCalendarButton';

interface CalendarCheckBoxListProps {
  userRole: KeyOfRole;
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
    <ul className="h-full overflow-auto rounded-xl bg-white px-5 pt-5 shadow-card scrollbar-hide">
      {calendarListByCategory.map(({ category, calendarList }) => (
        <Accordion
          key={category}
          title={category}
          className="mb-6"
          titleClassName="text-mainGreen text-sm text-darkGray-active mb-3 [&>button>svg]:text-xs [&>button>svg]:text-darkGray-active"
          initialOpen
          tooltip={
            category === '교육과정 캘린더' &&
            calendarList.length === 0 &&
            isPreTrainee(userRole)
              ? '훈련생이 되면 교육과정과 관련된 일정을 볼 수 있어요.'
              : undefined
          }
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
                        {isManagerAndAdmin(userRole) && (
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
                        {isManagerAndAdmin(userRole) && (
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
