import { useCallback } from 'react';

import { usePostNoticeSessions } from '@/services/notice/noticeMutations';

import { useDialogContext } from '@/hooks';
import { NoticeSession } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import {
  Controller,
  FormProvider,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
  useWatch,
} from 'react-hook-form';

import SquareButton from '@/components/common/button/SquareButton';
import ControllerPhoneNumber from '@/components/common/input/ControllerPhoneNumber';
import ErrorMsg from '@/components/common/input/ErrorMsg';
import Modal from '@/components/common/modal/Modal';
import { noticeModalFormSchema } from '@/components/notice/modal/NoticeModalFormSchema';
import SessionSelectBox from '@/components/notice/modal/SessionSelectBox';

interface NoticeModalProps {
  sessions: NoticeSession[];
  isPhoneNumberRequired: boolean;
  participantCapacity: number;
}

export interface FormValues {
  isPhoneNumberRequired: boolean;
  phoneNumber: string;
  sessionIdList: number[];
}

const initialValue: FormValues = {
  sessionIdList: [],
  phoneNumber: '',
  isPhoneNumberRequired: false,
};

export default function NoticeModal({
  sessions,
  isPhoneNumberRequired,
  participantCapacity,
}: NoticeModalProps) {
  const { hideDialog, showToast } = useDialogContext();

  const { mutateAsync: postNoticeSession } = usePostNoticeSessions();

  const methods = useForm<FormValues>({
    defaultValues: { ...initialValue, isPhoneNumberRequired },
    resolver: zodResolver(noticeModalFormSchema),
  });

  const { control, handleSubmit } = methods;

  const onSubmit: SubmitHandler<FormValues> = useCallback(
    async ({ phoneNumber, sessionIdList }: FormValues) => {
      try {
        const onlyNumericPhoneNumberValue = phoneNumber.replace(/\D/g, '');
        await Promise.all(
          sessionIdList.map(sessionId =>
            postNoticeSession({
              phoneNumber: onlyNumericPhoneNumberValue,
              sessionId,
            }),
          ),
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

  const onError: SubmitErrorHandler<{ phoneNumber: FormValues }> = useCallback(
    err => {
      const firstErrMsg = err.phoneNumber?.phoneNumber?.message || '';
      if (firstErrMsg) {
        showToast(firstErrMsg);
      }
    },
    [showToast],
  );

  const sessionIdList = useWatch({ name: 'sessionIdList', control });
  const phoneNumber = useWatch({ name: 'phoneNumber', control });

  const isNotValid = (!phoneNumber && isPhoneNumberRequired) || !sessionIdList;

  return (
    <Modal
      title="수업 선택하기"
      onToggleClick={hideDialog}
      className="p-[50px]"
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <Controller
            control={control}
            name="sessionIdList"
            render={({
              field: { onChange, value: selectedIdList },
              fieldState: { error },
            }) => {
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
                  {error && (
                    <ErrorMsg
                      msg={error?.message || ''}
                      className="absolute bottom-[-30px] left-0 ml-2"
                    />
                  )}
                </div>
              );
            }}
          />

          <div className="flex h-[50px] items-center justify-end gap-6">
            {sessions.length > 0 && isPhoneNumberRequired && (
              <ControllerPhoneNumber name="phoneNumber" />
            )}

            <SquareButton
              name="신청하기"
              type="submit"
              disabled={isNotValid}
              color={isNotValid ? 'gray' : 'mainGreen'}
              className="h-full self-end whitespace-nowrap px-3 py-[12px] text-xl"
            />
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
}
