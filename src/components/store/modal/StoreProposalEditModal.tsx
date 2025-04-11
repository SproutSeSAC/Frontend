import { useCallback } from 'react';

import { useDialogContext } from '@/hooks';
import { Controller, SubmitErrorHandler, useForm } from 'react-hook-form';

import SquareButton from '@/components/common/button/SquareButton';
import ErrorMsg from '@/components/common/input/ErrorMsg';
import Modal from '@/components/common/modal/Modal';

interface FormValues {
  text: string;
}

export default function StoreProposalEditModal() {
  const { hideDialog, showToast } = useDialogContext();
  const methods = useForm<FormValues>({
    defaultValues: {
      text: '',
    },
    // resolver: zodResolver(),
  });
  const { control, handleSubmit } = methods;

  const onSubmit = useCallback(async (data: FormValues) => {
    console.log(data);
  }, []);

  const onError: SubmitErrorHandler<FormValues> = useCallback(
    err => {
      console.error('hook form error >>', {
        data: methods.getValues(),
        error: err,
      });
      const firstErrorMessage = Object.entries(err)?.[0]?.[1].message || '';

      if (firstErrorMessage) {
        showToast(firstErrorMessage);
      }
    },
    [methods, showToast],
  );

  return (
    <Modal onClose={hideDialog} title="정보 수정 제안하기">
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="flex flex-col"
      >
        <Controller
          control={control}
          name="text"
          render={({ field: { onChange }, fieldState: { error } }) => {
            return (
              <div className="flex flex-col">
                <textarea
                  className={`mt-2 h-40 resize-none rounded-2xl border border-solid border-mainGray px-4 py-[10px] text-base focus:outline-none ${error && 'border-red-500'}`}
                  placeholder="수정하려는 정보를 입력해주세요"
                  onChange={onChange}
                />

                {error && (
                  <ErrorMsg msg={error?.message || ''} className="ml-2" />
                )}
              </div>
            );
          }}
        />

        <SquareButton
          name="제보하기"
          type="submit"
          className="mt-10 self-end"
        />
      </form>
    </Modal>
  );
}
