import { useGetUserProfile } from '@/services/auth/authQueries';

import { calendarIdsAtom } from '@/atoms/calendarAtom';

import { Calendar, RoleKey } from '@/types';
import { hasAdmin, isTrainee } from '@/utils';
import { useAtomValue } from 'jotai';

import AclInfoButton from '@/components/calendar/AclInfoButton';
import Checkbox from '@/components/common/checkbox/Checkbox';

interface CalendarCheckBoxProps {
  calendar: Calendar & {
    courseId: number;
    courseTitle: string;
    calendarId: string;
  };
  onChange: (calendarId: string) => void;
}

export default function CourseCalendarCheckBox({
  calendar,
  onChange,
}: CalendarCheckBoxProps) {
  const currentCalendarIds = useAtomValue(calendarIdsAtom);

  const { data: userProfile } = useGetUserProfile();

  const getDisabledByRole = (role: RoleKey) => {
    if (isTrainee(role)) {
      return !calendar.calendarId;
    }
    return !calendar.summary;
  };

  const disabled = userProfile?.role && getDisabledByRole(userProfile?.role);

  return (
    userProfile?.role && (
      <div
        key={calendar.courseId}
        className="flex items-start justify-between [&>label]:items-start"
      >
        <Checkbox
          id={calendar.courseTitle}
          text={calendar.summary || calendar.courseTitle}
          checked={!!currentCalendarIds?.includes(calendar.calendarId)}
          onChange={() => onChange(calendar.calendarId)}
          textClassName={`line-clamp-2 ${
            disabled ? '!text-mainGray' : '!text-black'
          }`}
          inputClassName="mt-1"
          checkBoxColor={calendar.backgroundColor}
          disabled={disabled}
        />

        {hasAdmin(userProfile?.role) &&
          calendar.calendarId &&
          !calendar.accessRole && (
            <AclInfoButton
              courseId={calendar.courseId}
              calendarId={calendar.calendarId}
            />
          )}
      </div>
    )
  );
}
