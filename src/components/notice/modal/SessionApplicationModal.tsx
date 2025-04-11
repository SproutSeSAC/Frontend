import { useCallback } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { usePostSessionApply } from '@/services/post/noticeMutations';

import { useDialogContext } from '@/hooks';
import { NoticeSession } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
  useWatch,
} from 'react-hook-form';

import SquareButton from '@/components/common/button/SquareButton';
import ErrorMsg from '@/components/common/input/ErrorMsg';
import Modal from '@/components/common/modal/Modal';
import { sessionApplicationModalFormSchema } from '@/components/notice/modal/SessionApplicationModalFormSchema';
import SessionSelectBox from '@/components/notice/modal/SessionSelectBox';

interface NoticeModalProps {
  sessions: NoticeSession[];
  participantCapacity: number;
  postId: number;
}

export interface FormValues {
  sessionIdList: number[];
}

const initialValue: FormValues = {
  sessionIdList: [],
};

export default function SessionApplicationModal({
  sessions,
  postId,
  participantCapacity,
}: NoticeModalProps) {
  const { hideDialog, showToast } = useDialogContext();

  const { mutateAsync: postNoticeSession } = usePostSessionApply();

  const methods = useForm<FormValues>({
    defaultValues: initialValue,
    resolver: zodResolver(sessionApplicationModalFormSchema),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  const queryClient = useQueryClient();

  const onSubmit: SubmitHandler<FormValues> = useCallback(
    async ({ sessionIdList }: FormValues) => {
      try {
        await Promise.all(
          sessionIdList.map(sessionId => postNoticeSession({ sessionId })),
        );
        await queryClient.invalidateQueries({
          queryKey: ['useGetPostDetail', postId],
        });
        await hideDialog();
        showToast(
          '신청했습니다. 신청 내역은 마이페이지에서 확인할 수 있습니다.',
        );
      } catch {
        showToast('예기치 못한 오류가 발생했습니다');
      }
    },
    [hideDialog, postId, postNoticeSession, queryClient, showToast],
  );

  const sessionIdList = useWatch({ name: 'sessionIdList', control });

  const hasAllSessionStatus = !sessions.find(
    ({ currentStatus }) => currentStatus === null,
  );

  const formDisabled = !sessionIdList || hasAllSessionStatus;

  return (
    <Modal title="특강/행사 선택하기" onClose={hideDialog}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          <Controller
            control={control}
            name="sessionIdList"
            render={({ field: { onChange, value: selectedIdList } }) => {
              return (
                <ul className="mb-6 mt-4 grid grid-cols-2 justify-between gap-x-6 gap-y-4">
                  {sessions.map(session => {
                    const { sessionId, currentStatus } = session;

                    const hasStatus = currentStatus !== null;
                    const fullCapacity =
                      participantCapacity <= session.participantCount;

                    const disabled = hasStatus || fullCapacity;
                    const disabledMsg = {
                      hasStatus: '이미 신청한 회차입니다.',
                      fullCapacity: '정원이 다 찼습니다.',
                    };

                    const hasSessionId = !!selectedIdList.includes(sessionId);

                    return (
                      <li key={sessionId}>
                        <SessionSelectBox
                          session={session}
                          isSelected={hasSessionId}
                          disabled={!!disabled}
                          onClick={() => {
                            const idList = hasSessionId
                              ? selectedIdList.filter(id => id !== sessionId)
                              : [...selectedIdList, sessionId];

                            onChange(idList);
                          }}
                          errorMsg={
                            hasStatus
                              ? disabledMsg.hasStatus
                              : disabledMsg.fullCapacity
                          }
                        />
                      </li>
                    );
                  })}
                </ul>
              );
            }}
          />

          {errors && <ErrorMsg msg={errors?.sessionIdList?.message || ''} />}

          <SquareButton
            name="신청하기"
            type="submit"
            disabled={formDisabled}
            color={formDisabled ? 'lightGray' : 'mainGreen'}
            className="h-full self-end whitespace-nowrap px-3 text-lg"
          />
        </form>
      </FormProvider>
    </Modal>
  );
}
