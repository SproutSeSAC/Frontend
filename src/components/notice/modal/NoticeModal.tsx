import { useCallback } from 'react';

import { usePostNoticeSessions } from '@/services/post/noticeMutations';

import { useDialogContext } from '@/hooks';
import { NoticeSession } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
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
import { noticeModalFormSchema } from '@/components/notice/modal/NoticeModalFormSchema';
import SessionSelectBox from '@/components/notice/modal/SessionSelectBox';

interface NoticeModalProps {
  sessions: NoticeSession[];
  participantCapacity: number;
}

export interface FormValues {
  sessionIdList: number[];
}

const initialValue: FormValues = {
  sessionIdList: [],
};

export default function NoticeModal({
  sessions,
  participantCapacity,
}: NoticeModalProps) {
  const { hideDialog, showToast } = useDialogContext();

  const { mutateAsync: postNoticeSession } = usePostNoticeSessions();

  const methods = useForm<FormValues>({
    defaultValues: initialValue,
    resolver: zodResolver(noticeModalFormSchema),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit: SubmitHandler<FormValues> = useCallback(
    async ({ sessionIdList }: FormValues) => {
      try {
        await Promise.all(
          sessionIdList.map(sessionId => postNoticeSession({ sessionId })),
        );
        showToast(
          '신청하였습니다. 신청 내역은 마이페이지에서 확인할 수 있습니다.',
        );
        hideDialog();
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          showToast(err?.response?.data || '신청하지 못했습니다');
        } else {
          showToast('예기치 못한 오류가 발생했습니다');
        }
      }
    },
    [hideDialog, postNoticeSession, showToast],
  );

  const sessionIdList = useWatch({ name: 'sessionIdList', control });

  const isNotValid = !sessionIdList;

  return (
    <Modal
      title="수업 선택하기"
      onToggleClick={hideDialog}
      className="p-[50px]"
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            name="sessionIdList"
            render={({ field: { onChange, value: selectedIdList } }) => {
              return (
                <div className="relative">
                  <ul className="mb-20 mt-14 grid grid-cols-2 gap-6">
                    {sessions.map(session => {
                      const { sessionId } = session;
                      const hasSessionId = !!selectedIdList.includes(sessionId);
                      const disabled =
                        participantCapacity <= session.participantCount;

                      return (
                        <li key={sessionId}>
                          <SessionSelectBox
                            session={session}
                            isSelected={hasSessionId}
                            disabled={disabled}
                            onClick={() => {
                              const idList = hasSessionId
                                ? selectedIdList.filter(id => id !== sessionId)
                                : [...selectedIdList, sessionId];
                              onChange(idList);
                            }}
                          />
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            }}
          />

          {errors && (
            <ErrorMsg
              msg={errors?.sessionIdList?.message || ''}
              className="pl-2"
            />
          )}

          <SquareButton
            name="신청하기"
            type="submit"
            disabled={isNotValid}
            color={isNotValid ? 'gray' : 'mainGreen'}
            className="h-full self-end whitespace-nowrap px-3 py-[12px] text-xl"
          />
        </form>
      </FormProvider>
    </Modal>
  );
}
