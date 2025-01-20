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
    <Modal
      className="p-[50px]"
      onToggleClick={() => {
        hideDialog('STORE-PROPOSAL-EDIT-MODAL-TYPE');
      }}
      title={<div className="mb-4 text-2xl">정보 수정 제안하기</div>}
    >
      <form onSubmit={handleSubmit(onSubmit, onError)} className="w-[716px]">
        <Controller
          control={control}
          name="text"
          render={({ field: { onChange }, fieldState: { error } }) => {
            return (
              <div className="flex flex-col">
                <textarea
                  className={`mt-10 h-20 resize-none rounded-2xl border border-solid border-mainGray px-4 py-[10px] text-base ${error && 'border-red-500'}`}
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

        <div className="flex justify-end">
          <SquareButton
            name="제보하기"
            type="submit"
            className="mt-20 self-end"
          />
        </div>
      </form>
    </Modal>
  );
}
