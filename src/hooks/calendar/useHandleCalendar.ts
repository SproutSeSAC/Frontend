import { useQueryClient } from '@tanstack/react-query';

import { useCreateCalendar } from '@/services/calendar/calendarMutations';

import { useDialogContext } from '@/hooks';

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
