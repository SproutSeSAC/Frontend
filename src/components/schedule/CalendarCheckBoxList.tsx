import { useGetUserProfile } from '@/services/auth/authQueries';
import {
  useGetCampusList,
  useGetCourseList,
} from '@/services/course/courseQueries';
import { useGetCalendarIdByCourse } from '@/services/schedule/calendarQueries';

import { calendarIdsAtom } from '@/atoms/calendarAtom';

import { Calendar, CalendarListByCategory, KeyOfRole } from '@/types';
import { useAtom } from 'jotai';

import Accordion from '@/components/common/Accordion';
import Checkbox from '@/components/common/checkbox/Checkbox';
import CreateCalendarButton from '@/components/schedule/CreateCalendarButton';
import SubscribeCalendarButton from '@/components/schedule/SubscribeCalendarButton';

interface CalendarCheckBoxListProps {
  userRole: KeyOfRole;
  calendarListByType: {
    myCalendarList: Calendar[];
    subscribeCalendarList: Calendar[];
  };
}

export default function CalendarCheckBoxList({
  userRole,
  calendarListByType,
}: CalendarCheckBoxListProps) {
  const [currentCalendarIds, setCurrentCalendarIds] = useAtom(calendarIdsAtom);

  const { data: userProfile } = useGetUserProfile();

  const { data: campusList } = useGetCampusList();

  const { subscribeCalendarList, myCalendarList } = calendarListByType;

  const calendarListByLabel: CalendarListByCategory[] = [
    {
      category: '구독중인 캘린더',
      calendarList: subscribeCalendarList,
    },
    { category: '나의 캘린더', calendarList: myCalendarList },
  ];

  // NOTE: API가 변경되어 교육과정 ID를 바로 내려주면 삭제 예정
  const userCampus = campusList?.find(
    ({ name }) => name === userProfile?.campusName,
  );
  const { data: courseList } = useGetCourseList(userCampus?.id);
  const userCourse = courseList?.find(
    course => course.title === userProfile?.courseTitle,
  );
  // -----------------------------------

  const { data: calendarIdByCourse, isLoading: isCalenderIdLoading } =
    useGetCalendarIdByCourse(userCourse?.id);
  const sproutCalendarId = calendarIdByCourse?.calendarId;

  const sproutCalendar =
    sproutCalendarId &&
    [...subscribeCalendarList, ...myCalendarList].find(
      ({ id }) => id === sproutCalendarId,
    );

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

  return (
    <ul className="h-full overflow-auto rounded-xl bg-white px-5 pt-5 shadow-card scrollbar-hide">
      {calendarListByLabel.map(({ category, calendarList }) => (
        <Accordion
          key={category}
          title={category}
          className="mb-6"
          titleClassName="text-oliveGreen1 text-sm text-gray1 mb-3 [&>button>svg]:text-xs [&>button>svg]:text-gray1"
          initialOpen={
            userRole === 'TRAINEE'
              ? category === '구독중인 캘린더'
              : category === '나의 캘린더'
          }
        >
          {userRole === 'TRAINEE' ? (
            <ul className="flex flex-col gap-2">
              {category === '구독중인 캘린더' &&
                userProfile &&
                userCourse &&
                !isCalenderIdLoading &&
                !sproutCalendar && (
                  <SubscribeCalendarButton
                    courseTitle={userProfile.courseTitle}
                    courseId={userCourse.id}
                  />
                )}

              {calendarList?.map(
                ({ id, summary, backgroundColor, primary }) => (
                  <Checkbox
                    key={id}
                    id={id}
                    text={primary ? '기본 캘린더' : summary}
                    checked={!!currentCalendarIds?.includes(id)}
                    onChange={() => onCheckBoxChange(id)}
                    textClassName="!text-text"
                    checkBoxColor={backgroundColor}
                  />
                ),
              )}
            </ul>
          ) : (
            <ul className="flex flex-col gap-2 border">
              {category === '나의 캘린더' &&
                userRole === 'EDU_MANAGER' &&
                userProfile &&
                userCourse &&
                !isCalenderIdLoading &&
                !sproutCalendar && (
                  <CreateCalendarButton
                    courseTitle={userProfile.courseTitle}
                    courseId={userCourse.id}
                  />
                )}

              {calendarList?.map(
                ({ id, summary, backgroundColor, primary }) => (
                  <Checkbox
                    key={id}
                    id={id}
                    text={primary ? '기본 캘린더' : summary}
                    checked={!!currentCalendarIds?.includes(id)}
                    onChange={() => onCheckBoxChange(id)}
                    textClassName="!text-text"
                    checkBoxColor={backgroundColor}
                  />
                ),
              )}
            </ul>
          )}
        </Accordion>
      ))}
    </ul>
  );
}
