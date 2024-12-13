import { useCallback } from 'react';

import { usePostNoticeSessions } from '@/services/notice/noticeMutations';

import { dateFormat } from '@/utils/dateFormat';

import ErrorMsg from '../../common/input/ErrorMsg';
import Modal from '../../common/modal/Modal';
import NoticeModalForm from './NoticeModalForm';

import { useDialogContext } from '@/hooks';
import { NoticeSession } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import {
  Controller,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { z } from 'zod';

interface NoticeModalProps {
  sessions: NoticeSession[];
  isPhoneNumberRequired: boolean;
}

export interface FormValues {
  phoneNumber: string;
  sessionId: number;
  isPhoneNumberRequired: boolean;
}
const noticeModalFormSchema = z
  .object({
    sessionId: z
      .number()
      .min(1, '신청기간을 선택해 주세요.')
      .refine(value => value > 0, {
        message: '신청기간을 선택해 주세요.',
      }),
    isPhoneNumberRequired: z.boolean().optional(),
    phoneNumber: z
      .string()
      .optional()
      .superRefine((value, ctx) => {
        if (value) {
          const phoneRegex = /^010\d{7,8}$/;
          const sanitizedValue = value.replace(/\D/g, '');

          if (!phoneRegex.test(sanitizedValue)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: '올바른 연락처 형식이 아닙니다',
              path: ['phoneNumber'],
            });
          }
        }
      }),
  })
  .refine(
    data => {
      if (data.isPhoneNumberRequired && !data.phoneNumber) {
        return false;
      }
      return true;
    },
    {
      message: '연락처를 입력해주세요',
      path: ['phoneNumber'],
    },
  );

const initValue = {
  phoneNumber: '',
  sessionId: 0,
  isPhoneNumberRequired: false,
};

export default function NoticeModal({
  sessions,
  isPhoneNumberRequired,
}: NoticeModalProps) {
  const { hideDialog, showToast } = useDialogContext();
  const { mutateAsync: postNoticeSession } = usePostNoticeSessions();

  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: initValue,
    values: {
      ...initValue,
      isPhoneNumberRequired,
    },
    resolver: zodResolver(noticeModalFormSchema),
  });

  const onsubmit: SubmitHandler<FormValues> = useCallback(
    async data => {
      try {
        const newPhoneNumber = data.phoneNumber.replace(/\D/g, '');
        await postNoticeSession({
          phoneNumber: newPhoneNumber,
          sessionId: data.sessionId,
        });
        showToast('신청하였습니다');
        hideDialog();
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          console.error(err);
          showToast(err?.response?.data || '신청하지 못했습니다');
        } else {
          console.error(err);
          showToast('예기치 못한 오류가 발생했습니다');
        }
      }
    },
    [hideDialog, postNoticeSession, showToast],
  );

  const onError: SubmitErrorHandler<{ phoneNumber: FormValues }> = useCallback(
    err => {
      console.error('hook form error >>', {
        error: err,
      });
      const firstErrorMessage = err.phoneNumber?.phoneNumber?.message || '';

      if (firstErrorMessage) {
        showToast(firstErrorMessage);
      }
    },
    [showToast],
  );

  return (
    <Modal
      title="수업 선택하기"
      onToggleClick={hideDialog}
      className="p-[50px]"
    >
      <form onSubmit={handleSubmit(onsubmit, onError)}>
        <Controller
          control={control}
          name="sessionId"
          render={({ field: { onChange, value }, fieldState: { error } }) => {
            return (
              <div className="relative">
                <ul className="mb-20 mt-14 grid grid-cols-2 gap-6">
                  {(sessions || []).map(item => {
                    return (
                      <li
                        key={item.sessionId}
                        className="w-[294px] rounded-2xl shadow-card"
                      >
                        <input
                          type="radio"
                          id={`radio-${item}`}
                          name="classSchedule"
                          className="peer hidden"
                          value={value}
                          disabled={item.currentStatus === null}
                          onChange={() => onChange(item.sessionId)}
                        />
                        <label
                          htmlFor={`radio-${item}`}
                          className={`block cursor-pointer rounded-2xl px-5 py-6 ${item.currentStatus === null ? 'bg-gray4 text-gray2' : 'peer-checked:border peer-checked:border-solid peer-checked:border-oliveGreen1 peer-checked:bg-oliveGreen3'} `}
                        >
                          <div>수업 일시</div>
                          <div>
                            {dateFormat(
                              item.sessionStartDateTime,
                              'yyyy년 M월 d일 EEEE',
                            )}
                          </div>
                          <div>{`${dateFormat(
                            item.sessionStartDateTime,
                            'HH:mm',
                          )} ~ ${dateFormat(
                            item.sessionEndDateTime,
                            'HH:mm',
                          )}`}</div>
                        </label>
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
        <NoticeModalForm
          control={control}
          isPhoneNumberRequired={isPhoneNumberRequired}
        />
      </form>
    </Modal>
  );
}
