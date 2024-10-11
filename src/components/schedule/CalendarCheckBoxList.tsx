import { useSubscribeAndShareCalendar } from '@/hooks/useSubscribeAndShareCalendar';

import { calendarIdsAtom } from '@/atoms/calendarAtom';

import { adminCalendarListLabel } from '@/constants';
import { useToggleModal } from '@/hooks';
import { Calendar } from '@/types/calendarDto';
import { useAtom } from 'jotai';

import SquareButton from '@/components/common/button/SquareButton';
import Checkbox from '@/components/common/checkbox/Checkbox';
import TextInput from '@/components/common/input/TextInput';
import Alert from '@/components/common/modal/Alert';
import AddSubscribeCalenderButton from '@/components/schedule/AddSubscribeCalendarButton';

type CalendarListLabel = '나의 캘린더' | '구독중인 캘린더' | '공유중인 캘린더';

type CalendarListByLabel = {
  label: CalendarListLabel;
  calendarList: Calendar[];
};
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

  const { toggleModal, modalOpen } = useToggleModal();

  const {
    currentAdminCalendar,
    onConfirmSubscribeClick,
    onConfirmShareClick,
    onAdminCalendarClick,
  } = useSubscribeAndShareCalendar({ toggleModal });

  const { myCalendarList, subscribeCalendarList } = calendarListByType;

  const calendarListByLabel: CalendarListByLabel[] = [
    { label: '구독중인 캘린더', calendarList: subscribeCalendarList },
    { label: '나의 캘린더', calendarList: myCalendarList },
  ];

  const onCheckBoxChange = (id: string) => {
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
    <div className="h-full flex-1 rounded-xl bg-white p-5 shadow-card">
      {calendarListByLabel.map(({ label, calendarList }) => (
        <div key={label}>
          <h2 className="mb-3 flex items-center justify-between gap-1 text-[15px] text-gray1">
            {label}
          </h2>

          <ul className="mb-10 flex flex-col gap-2">
            {(label === '구독중인 캘린더' || label === '공유중인 캘린더') &&
              adminCalendarListLabel.map(adminLabel => (
                <AddSubscribeCalenderButton
                  key={adminLabel}
                  name={adminLabel}
                  onAdminCalendarClick={onAdminCalendarClick}
                />
              ))}

            {calendarList?.map(({ id, summary, backgroundColor }) => (
              <Checkbox
                key={id}
                id={id}
                text={summary}
                checked={!!currentCalendarIds?.includes(id)}
                onChange={() => onCheckBoxChange(id)}
                textClassName="!text-text"
                checkBoxColor={backgroundColor}
              />
            ))}
          </ul>
        </div>
      ))}

      {modalOpen &&
        // 매니저인 경우
        (0 ? (
          <Alert
            text={`${currentAdminCalendar} 공유`}
            subText="위의 캘린더를 공유하시겠습니까?"
            className="gap-1"
          >
            <div className="flex w-full flex-col">
              <TextInput
                name="공유 캘린더 링크"
                placeholder="공유할 캘린더의 링크를 작성해주세요"
                onChange={() => {}}
                className="mt-4 h-[40px] w-60 text-[15px] text-gray1 hover:placeholder:text-gray1"
              />
              <div className="flex w-full items-center justify-center gap-2">
                <SquareButton
                  name="취소"
                  onClick={toggleModal}
                  type="button"
                  color="gray"
                  className="mt-5"
                />
                <SquareButton
                  name="공유"
                  onClick={onConfirmShareClick}
                  type="button"
                  className="mt-5"
                />
              </div>
            </div>
          </Alert>
        ) : (
          <Alert
            text={`${currentAdminCalendar} 구독`}
            subText="위의 캘린더를 구독하시겠습니까?"
            className="gap-1"
          >
            <SquareButton
              name="취소"
              onClick={toggleModal}
              type="button"
              color="gray"
              className="mt-5"
            />
            <SquareButton
              name="구독"
              onClick={onConfirmSubscribeClick}
              type="button"
              className="mt-5"
            />
          </Alert>
        ))}
    </div>
  );
}
