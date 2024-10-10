import { calendarIdsAtom } from '@/atoms/calendarAtom';

import { Calendar } from '@/types/calendarDto';
import { useAtom } from 'jotai';
import { FiCalendar } from 'react-icons/fi';

import Checkbox from '@/components/common/checkbox/Checkbox';

interface CalendarCheckBoxListProps {
  calendarListByType: {
    myCalendarList: Calendar[];
    subscribeCalendarList: Calendar[];
  };
}

export default function CalendarCheckBoxList({
  calendarListByType,
}: CalendarCheckBoxListProps) {
  const [currentCalendarIds, setCurrentCalendarIds] = useAtom(calendarIdsAtom);

  const { myCalendarList, subscribeCalendarList } = calendarListByType;

  const calendarListByLabel = [
    { label: '구독 캘린더', calendarList: subscribeCalendarList },
    { label: '나의 캘린더', calendarList: myCalendarList },
  ];

  const onChange = (id: string) => {
    if (currentCalendarIds?.includes(id)) {
      const filteredIds = currentCalendarIds.filter(
        currentId => currentId !== id,
      );
      setCurrentCalendarIds(filteredIds);
    } else {
      setCurrentCalendarIds([...(currentCalendarIds as string[]), id]);
    }
  };

  return (
    <div className="h-full rounded-xl bg-white p-5 shadow-card">
      {calendarListByLabel.map(({ label, calendarList }) => (
        <div key={label}>
          <h2 className="mb-2 flex items-center gap-1 text-[15px] text-gray2">
            <FiCalendar className="text-base" />
            {label}
          </h2>

          <ul className="mb-10 flex flex-col gap-2">
            {calendarList?.map(({ id, summary, backgroundColor }) => (
              <Checkbox
                key={id}
                id={id}
                text={summary}
                checked={!!currentCalendarIds?.includes(id)}
                onChange={() => onChange(id)}
                textClassName="!text-text"
                checkBoxColor={backgroundColor}
              />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
