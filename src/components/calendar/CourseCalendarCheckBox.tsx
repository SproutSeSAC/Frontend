import { useGetUserProfile } from '@/services/auth/authQueries';

import { calendarIdsAtom } from '@/atoms/calendarAtom';

import { Calendar } from '@/types';
import { hasAdmin } from '@/utils';
import { useAtom } from 'jotai';

import AclInfoButton from '@/components/calendar/AclInfoButton';
import Checkbox from '@/components/common/checkbox/Checkbox';

interface CalendarCheckBoxProps {
  calendar: Calendar & {
    courseId: number;
    courseTitle: string;
    calendarId: string;
  };
}

export default function CourseCalendarCheckBox({
  calendar,
}: CalendarCheckBoxProps) {
  const [currentCalendarIds, setCurrentCalendarIds] = useAtom(calendarIdsAtom);

  const { data: userProfile } = useGetUserProfile();

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
    <div
      key={calendar.courseId}
      className="flex items-start justify-between [&>label]:items-start"
    >
      <Checkbox
        id={calendar.courseTitle}
        text={calendar.summary || calendar.courseTitle}
        checked={!!currentCalendarIds?.includes(calendar.id)}
        onChange={() => onCheckBoxChange(calendar.id)}
        textClassName={
          calendar.summary ? '!text-black' : '!text-mainGray-active'
        }
        checkBoxColor={calendar.backgroundColor}
        disabled={!calendar.summary}
      />

      {/* NOTE: 교육과정 정보에 캘린더 아이디가 저장됐는지 확인. */}
      {/* 매니저만 권한 확인후 나의 캘린더에 추가하는 용 */}
      {/* 권한이 없을 때도 있음. */}
      {hasAdmin(userProfile?.role) && calendar.calendarId && (
        <AclInfoButton
          courseId={calendar.courseId}
          calendarId={calendar.calendarId}
          accessRole={calendar.accessRole}
        />
      )}
    </div>
  );
}
