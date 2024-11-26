import { Fragment, useMemo } from 'react';

import {
  initialUserProfile,
  useGetUserProfile,
} from '@/services/auth/authQueries';

import { calendarIdsAtom } from '@/atoms/calendarAtom';

import { Calendar, CalendarListByCategory, KeyOfRole } from '@/types';
import { isManagerAndAdmin, isPreTrainee, isTrainee } from '@/utils';
import { useAtom } from 'jotai';

import Accordion from '@/components/common/Accordion';
import Checkbox from '@/components/common/checkbox/Checkbox';
import CreateCalendarButton from '@/components/schedule/CreateCalendarButton';
import SubscribeCalendarButton from '@/components/schedule/SubscribeCalendarButton';

interface CalendarCheckBoxListProps {
  userRole: KeyOfRole;
  courseCalendarList: Calendar[];
  personalCalendarList: Calendar[];
}

export default function CalendarCheckBoxList({
  userRole,
  courseCalendarList,
  personalCalendarList,
}: CalendarCheckBoxListProps) {
  const [currentCalendarIds, setCurrentCalendarIds] = useAtom(calendarIdsAtom);

  const {
    data: userProfile = initialUserProfile,
    isLoading: isUserProfileLoading,
  } = useGetUserProfile();

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
        category: 'Sprout 캘린더',
        calendarList: courseCalendarList,
      },
      { category: '나의 캘린더', calendarList: personalCalendarList },
    ],
    [courseCalendarList, personalCalendarList],
  );

  if (isUserProfileLoading) return null;

  return (
    <ul className="h-full overflow-auto rounded-xl bg-white px-5 pt-5 shadow-card scrollbar-hide">
      {calendarListByCategory.map(({ category, calendarList }) => (
        <Accordion
          key={category}
          title={category}
          className="mb-6"
          titleClassName="text-oliveGreen1 text-sm text-gray1 mb-3 [&>button>svg]:text-xs [&>button>svg]:text-gray1"
          initialOpen
          tooltip={
            (isTrainee(userRole) || isPreTrainee(userRole)) &&
            category === 'Sprout 캘린더' &&
            calendarList.length === 0
              ? '훈련생이 되면 교육과정과 관련된 일정을 볼 수 있어요.'
              : undefined
          }
        >
          <ul className="flex flex-col gap-2">
            {category === 'Sprout 캘린더' &&
              calendarList?.map(
                ({
                  courseId,
                  courseTitle,
                  id,
                  backgroundColor,
                  summary,
                  isCreated,
                }) =>
                  isCreated ? (
                    <Checkbox
                      key={courseId}
                      id={courseId}
                      text={summary || courseTitle}
                      checked={!!currentCalendarIds?.includes(id)}
                      onChange={() => onCheckBoxChange(id)}
                      textClassName="!text-text"
                      checkBoxColor={backgroundColor}
                    />
                  ) : (
                    <Fragment key={courseId}>
                      {isTrainee(userRole) && (
                        <SubscribeCalendarButton
                          courseTitle={userProfile?.courseList[0]?.courseTitle}
                          courseId={userProfile?.courseList[0].courseId}
                        />
                      )}

                      {isManagerAndAdmin(userRole) && (
                        <CreateCalendarButton
                          courseTitle={courseTitle}
                          courseId={courseId}
                          userRole={userRole}
                        />
                      )}
                    </Fragment>
                  ),
              )}

            {category === '나의 캘린더' &&
              calendarList?.map(({ id, summary, backgroundColor, primary }) => (
                <Checkbox
                  key={id}
                  id={id}
                  text={primary ? '기본 캘린더' : summary}
                  checked={!!currentCalendarIds?.includes(id)}
                  onChange={() => onCheckBoxChange(id)}
                  textClassName="!text-text"
                  checkBoxColor={backgroundColor}
                />
              ))}
          </ul>
        </Accordion>
      ))}
    </ul>
  );
}
