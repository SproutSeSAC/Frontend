import { useQueryClient } from '@tanstack/react-query';

import { useGetUserProfile } from '@/services/auth/authQueries';
import { useCreateCalendar } from '@/services/schedule/calendarMutations';

import { rolesObj } from '@/constants';
import { useDialogContext } from '@/hooks';
import { AdminEmailListByCourseDto, Calendar } from '@/types';
import { getColorByRole } from '@/utils';

import SquareButton from '@/components/common/button/SquareButton';
import Tag from '@/components/common/tag/Tag';

interface CreateCalendarButtonProps {
  courseTitle: string;
  courseId: number;
  adminList?: AdminEmailListByCourseDto.Get;
}

export default function CalendarCreateButton({
  courseTitle,
  courseId,
  adminList,
}: CreateCalendarButtonProps) {
  const queryClient = useQueryClient();

  const { alert, hideDialog, loadingAlert } = useDialogContext();

  const {
    data: userProfile,
    isLoading: isUserProfileLoading, //
  } = useGetUserProfile();

  const {
    mutateAsync: createCalendar,
    isPending: isCreateCalendarPending, //
  } = useCreateCalendar({
    onMutate: async () => {
      loadingAlert({
        text: '캘린더 생성 중입니다... 잠시만 기다려주세요',
      });
    },
    onSuccess: async data => {
      const newCalendarId = (data as Calendar)?.id;

      if (!newCalendarId) {
        return;
      }

      await queryClient.invalidateQueries({
        queryKey: ['useGetCourseCalendar'],
      });

      await queryClient.invalidateQueries({
        queryKey: ['useGetCalendarAcl', newCalendarId],
      });

      await queryClient.refetchQueries({
        queryKey: ['useGetCourseCalendar'],
      });

      await queryClient.refetchQueries({
        queryKey: ['useGetCalendarAcl', newCalendarId],
      });

      hideDialog();
    },
  });

  const onCreateCalendarClick = () => {
    alert({
      text: '교육과정 캘린더 생성하기',
      subTextColor: 'green',
      subText: `<${courseTitle}> 과정에 대한 공개 캘린더를 생성하시겠어요?`,
      className: '!max-w-[600px]',
      children: (
        <div className="flex w-full flex-col items-center justify-center">
          <div className="mb-4 flex w-full flex-col items-center justify-center rounded-2xl border border-lightGray-hover bg-lightGray-hover px-6 py-5">
            <p className="text-center text-sm tracking-tighter text-darkGray-active">
              최고 관리자를 비롯하여 아래 유저에게는 캘린더 권한이 부여됩니다.
            </p>
            <ul className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-4">
              {adminList?.map(({ roleType, email, nickname }) => (
                <li key={email} className="flex">
                  <span className="tracking-tighter">{nickname}</span>
                  <Tag
                    size="small"
                    color={getColorByRole(roleType)}
                    emphasisText
                    text={rolesObj[roleType]}
                    className="ml-0.5 font-medium tracking-tighter"
                  />
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-center gap-2">
            <SquareButton
              name="취소"
              onClick={hideDialog}
              type="button"
              color="gray"
              className="mt-5"
            />
            {!isUserProfileLoading && userProfile && adminList && (
              <SquareButton
                name="생성"
                onClick={() => {
                  createCalendar({
                    courseId,
                    summary: courseTitle,
                    emailListToBeAuthorized: adminList,
                    currentRoleAndEmail: {
                      roleType: userProfile?.role,
                      email: userProfile?.email,
                    },
                  });
                  hideDialog();
                }}
                type="button"
                className="mt-5"
              />
            )}
          </div>
        </div>
      ),
    });
  };

  return (
    <button
      type="button"
      onClick={onCreateCalendarClick}
      className="rounded-md bg-mainGreen px-2.5 py-1.5 text-[13px] tracking-tighter text-white"
      disabled={isCreateCalendarPending}
    >
      생성하기
    </button>
  );
}
