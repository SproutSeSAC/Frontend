import { useGetUserProfile } from '@/services/auth/authQueries';
import { useCreateCalendar } from '@/services/schedule/calendarMutations';
import { useGetAdminEmailByCourse } from '@/services/schedule/calendarQueries';

import { calendarIdsAtom } from '@/atoms/calendarAtom';

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

  const { data: userProfile } = useGetUserProfile();

  const { data } = useGetAdminEmailByCourse('JOB_COORDINATOR');
  console.log(data);
  const { mutate } = useCreateCalendar('df', {
    CAMPUS_MANAGER: '',
    JOB_COORDINATOR: '',
  });

  const { alert, hideDialog } = useDialogContext();

  // '교육매니저'만 공유 캘린더 생성 가능
  const onEduManagerCalendarClick = () => {
    const onConfirmCreateClick = () => {
      mutate();
      hideDialog();
    };

    alert({
      showDim: true,
      className: 'z-30',
      text: `${userProfile?.courseTitle} 공유 캘린더`,
      subText: '위 캘린더를 생성하시겠어요?',
      children: (
        <div className="flex max-w-60 flex-col">
          <Title
            as="p"
            highlight="캠퍼스 매니저와 잡코디, 관리자"
            title="캠퍼스 매니저와 잡코디, 관리자가 함께 소유하는 캘린더가 생성됩니다."
            className="mt-2 px-2 text-center leading-6"
          />
          <div className="flex justify-center gap-2">
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
      ),
    });
  };

  const onTraineeCalendarClick = () => {
    const onConfirmSubscribeClick = () => {
      window.open('', '_blank'); // 공유 캘린더 링크 넣기
      hideDialog();
    };

    alert({
      showDim: true,
      className: 'z-30',
      text: `${userProfile?.courseTitle} 캘린더`,
      subText: `위 캘린더를 구독하시겠어요? `,
      children: (
        <div className="flex max-w-60 flex-col">
          <Title
            as="p"
            highlight={userProfile?.courseTitle}
            title={`${userProfile?.courseTitle}에 관련된 일정들을 확인할 수 있습니다.`}
            className="mt-2 px-2 text-center leading-6"
          />
          <div className="flex justify-center gap-2">
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
          </div>
        </div>
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
        {calendarListByLabel.map(({ label, calendarList }) =>
          userRole === 'TRAINEE' ? (
            <Accordion
              key={label}
              title={label}
              titleClassName="text-sm text-gray1 mb-3 [&>button>svg]:text-xs [&>button>svg]:text-gray1"
              className="mb-3"
              initialOpen={label === '구독중인 캘린더'}
            >
              <ul className="mb-4 flex flex-col gap-2">
                {label === '구독중인 캘린더' && (
                  <AddSubscribeCalenderButton
                    name={`${userProfile?.courseTitle} 캘린더 구독하기`}
                    onAdminCalendarClick={onTraineeCalendarClick}
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
          ) : (
            <Accordion
              key={label}
              title={label}
              titleClassName="text-sm text-gray1 mb-3 [&>button>svg]:text-xs [&>button>svg]:text-gray1"
              className="mb-3"
              initialOpen={label === '나의 캘린더'}
            >
              <ul className="mb-4 flex flex-col gap-2">
                {label === '나의 캘린더' && userRole === 'EDU_MANAGER' && (
                  <AddSubscribeCalenderButton
                    name={`${userProfile?.courseTitle} 캘린더 생성하기`}
                    onAdminCalendarClick={onEduManagerCalendarClick}
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
          ),
        )}
      </ul>
    </div>
  );
}
