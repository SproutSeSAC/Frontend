import { useCreateCalendar } from '@/services/schedule/calendarMutations';

import { calendarIdsAtom } from '@/atoms/calendarAtom';

import { AdminCalendarLabel, adminCalendarListLabel } from '@/constants';
import { useDialogContext } from '@/hooks';
import { KeyOfRole } from '@/types';
import { Calendar } from '@/types/calendarDto';
import { useAtom } from 'jotai';

import Accordion from '@/components/common/Accordion';
import Title from '@/components/common/Title';
import SquareButton from '@/components/common/button/SquareButton';
import Checkbox from '@/components/common/checkbox/Checkbox';
import AddSubscribeCalenderButton from '@/components/schedule/AddSubscribeCalendarButton';

type CalendarListLabel = '나의 캘린더' | '구독중인 캘린더' | '공유중인 캘린더';

type CalendarListByLabel = {
  label: CalendarListLabel;
  calendarList: Calendar[];
};
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

  const { myCalendarList, subscribeCalendarList } = calendarListByType;

  const { mutate } = useCreateCalendar();

  const { alert, hideDialog } = useDialogContext();

  /* 학생들의 구독 버튼 */
  const onConfirmSubscribeClick = () => {
    window.open('', '_blank'); // 공유 캘린더 링크 넣기
    hideDialog();
  };

  /* 매니저의 캘린더 생성 버튼 */
  const onConfirmCreateClick = () => {
    mutate();
    hideDialog();
  };

  const onAdminCalendarClick = (label: AdminCalendarLabel) => {
    const adminRole =
      userRole === 'CAMPUS_MANAGER' || userRole === 'EDU_MANAGER';

    alert({
      showDim: true,
      className: 'z-30',
      text: adminRole ? '공유 캘린더 생성' : `${label} 구독`,
      subText: adminRole
        ? '캘린더를 생성하시겠어요?'
        : '위의 캘린더를 구독하시겠어요?',
      children: adminRole ? (
        <div className="flex w-full flex-col">
          <Title
            as="p"
            highlight={label}
            title={`${label}를 생성하시겠어요?`}
            className="pt-2 text-gray1"
          />

          <div className="flex w-full items-center justify-center gap-2">
            <SquareButton
              name="취소"
              onClick={hideDialog}
              type="button"
              color="gray"
              className="mt-5"
            />
            <SquareButton
              name="생성"
              onClick={onConfirmCreateClick}
              type="button"
              className="mt-5"
            />
          </div>
        </div>
      ) : (
        <>
          <SquareButton
            name="취소"
            onClick={hideDialog}
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
        </>
      ),
    });
  };

  const calendarListByLabel: CalendarListByLabel[] = [
    {
      label: '구독중인 캘린더',
      calendarList: subscribeCalendarList,
    },
    { label: '나의 캘린더', calendarList: myCalendarList },
  ];

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
    <div className="h-full flex-1 rounded-xl bg-white shadow-card">
      <ul className="px-5 pb-0 pt-5">
        {calendarListByLabel.map(({ label, calendarList }) => (
          <Accordion
            key={label}
            title={label}
            titleClassName="text-sm text-gray1 mb-3 [&>button>svg]:text-xs [&>button>svg]:text-gray1"
            className="mb-3"
            initialOpen={
              userRole === 'TRAINEE'
                ? label === '구독중인 캘린더'
                : label === '나의 캘린더'
            }
          >
            <ul className="mb-4 flex flex-col gap-2">
              {userRole === 'TRAINEE' &&
                label === '구독중인 캘린더' &&
                adminCalendarListLabel.map(adminLabel => (
                  <AddSubscribeCalenderButton
                    key={adminLabel}
                    name={adminLabel}
                    label={adminLabel}
                    onAdminCalendarClick={onAdminCalendarClick}
                  />
                ))}

              {label === '나의 캘린더' &&
                (userRole === 'EDU_MANAGER' ||
                  userRole === 'CAMPUS_MANAGER') && (
                  <AddSubscribeCalenderButton
                    name="새싹 캘린더 생성하기"
                    label={
                      userRole === 'EDU_MANAGER'
                        ? '교육 매니저의 새싹 캘린더'
                        : '캠퍼스 매니저의 새싹 캘린더'
                    }
                    onAdminCalendarClick={onAdminCalendarClick}
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
          </Accordion>
        ))}
      </ul>
    </div>
  );
}
