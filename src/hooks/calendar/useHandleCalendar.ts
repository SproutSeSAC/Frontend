import { useQueryClient } from '@tanstack/react-query';

import { useDialogContext } from '@/hooks/common/useDialogContext';

import { useCreateCalendar } from '@/services/schedule/calendarMutations';

export const useHandleCalendar = ({ courseId }: { courseId: number }) => {
  const queryClient = useQueryClient();

  const { loadingAlert, hideDialog } = useDialogContext();

  const { mutateAsync: createCalendar, isPending: isCreateCalendarPending } =
    useCreateCalendar({
      onMutate: async () => {
        loadingAlert({ text: '캘린더 생성 중입니다... 잠시만 기다려주세요' });
      },
      onSuccess: async () => {
        await queryClient.fetchQuery({
          queryKey: ['useGetCourseCalendarStatus', courseId],
        });
        hideDialog();
      },
    });

  return {
    createCalendar,
    isCreateCalendarPending,
  };
};
