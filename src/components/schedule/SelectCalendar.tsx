import { ChangeEvent } from 'react';

import { calendarAtom } from '@/atoms/calendarAtom';

import { Calendar } from '@/types/calendarDto';
import { useSetAtom } from 'jotai';

interface SelectCalendarProps {
  calendarList: Calendar[];
}

export default function SelectCalendar({ calendarList }: SelectCalendarProps) {
  const setCurrentCalendar = useSetAtom(calendarAtom);

  const onChangeCalendar = (e: ChangeEvent<HTMLSelectElement>) => {
    const calendarId = e.currentTarget.value;
    const selectedCalendar = calendarList.find(item => item.id === calendarId);
    if (selectedCalendar) {
      setCurrentCalendar({
        id: selectedCalendar.id,
        title: selectedCalendar.summary,
      });
    }
  };

  const primaryCalendar = calendarList.find(item => item.primary);

  const calendarTypes = calendarList?.map(item => {
    return { id: item.id, title: item.summary };
  });

  return (
    <select
      onChange={onChangeCalendar}
      className="mb-3 border p-3"
      defaultValue={primaryCalendar?.id}
    >
      {calendarTypes.map(type => (
        <option key={type.id} value={type.id}>
          {type.title}
        </option>
      ))}
    </select>
  );
}
