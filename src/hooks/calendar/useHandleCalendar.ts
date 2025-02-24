import { useQueryClient } from '@tanstack/react-query';

import { useDialogContext } from '@/hooks/common/useDialogContext';

import { useCreateCalendar } from '@/services/schedule/calendarMutations';
import { getCalendarAcl } from '@/services/schedule/calendarQueries';

import { Calendar } from '@/types';

export const useHandleCalendar = ({ courseId }: { courseId: number }) => {
  const queryClient = useQueryClient();

  const { loadingAlert, hideDialog } = useDialogContext();

  const { mutateAsync: createCalendar, isPending: isCreateCalendarPending } =
    useCreateCalendar({
      onMutate: async () => {
        loadingAlert({ text: '캘린더 생성 중입니다... 잠시만 기다려주세요' });
      },

      onSuccess: async data => {
        await queryClient.fetchQuery({
          queryKey: ['useGetCourseCalendarStatus', courseId],
        });

        if ((data as Calendar).id) {
          const newCalendarId = (data as Calendar).id;

          await queryClient.invalidateQueries({
            queryKey: ['useGetCalendarAcl', courseId],
          });

          await queryClient.fetchQuery({
            queryKey: ['useGetCalendarAcl', courseId],
            queryFn: () => getCalendarAcl(newCalendarId),
          });

          await queryClient.fetchQuery({
            queryKey: ['useGetCalendarAcl', courseId],
            queryFn: () => getCalendarAcl(newCalendarId),
          });
        }

        hideDialog();
      },
    });

  return {
    createCalendar,
    isCreateCalendarPending,
  };
};
