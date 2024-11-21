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
  sproutCalendars: Calendar[];
  personalCalendars: Calendar[];
}

export default function CalendarCheckBoxList({
  userRole,
  sproutCalendars,
  personalCalendars,
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

  const calendarListByCategory: CalendarListByCategory[] = [
    {
      category: 'Sprout 캘린더',
      calendarList: sproutCalendars,
    },
    { category: '나의 캘린더', calendarList: personalCalendars },
  ];

  if (isUserProfileLoading) return null;

  return (
    <ul className="h-full overflow-auto rounded-xl bg-white px-5 pt-5 shadow-card scrollbar-hide">
      {calendarListByCategory.map(({ category, calendarList }) => (
        <Accordion
          key={category}
          title={category}
          className="mb-6"
          titleClassName="text-oliveGreen1 text-sm text-gray1 mb-3 [&>button>svg]:text-xs [&>button>svg]:text-gray1"
          initialOpen={category === 'Sprout 캘린더'}
          tooltip={
            (isTrainee(userRole) || isPreTrainee(userRole)) &&
            category === 'Sprout 캘린더'
              ? '훈련생이 되면 교육과정과 관련된 일정을 볼 수 있습니다.'
              : undefined
          }
        >
          <ul className="flex flex-col gap-2">
            {category === 'Sprout 캘린더' && sproutCalendars.length === 0 && (
              <>
                {isTrainee(userRole) && (
                  <SubscribeCalendarButton
                    courseTitle={userProfile?.courseList[0]?.courseTitle}
                    courseId={userProfile?.courseList[0].courseId}
                  />
                )}

                {isManagerAndAdmin(userRole) &&
                  userProfile?.courseList.map(({ courseId, courseTitle }) => (
                    <CreateCalendarButton
                      key={courseId}
                      courseTitle={courseTitle}
                      courseId={courseId}
                      userRole={userRole}
                    />
                  ))}
              </>
            )}
            {calendarList?.map(({ id, summary, backgroundColor, primary }) => (
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
