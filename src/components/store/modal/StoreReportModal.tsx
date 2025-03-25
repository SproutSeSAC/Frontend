import { useCallback } from 'react';

import { useDialogContext } from '@/hooks';
import { Controller, SubmitErrorHandler, useForm } from 'react-hook-form';

import SquareButton from '@/components/common/button/SquareButton';
import ErrorMsg from '@/components/common/input/ErrorMsg';
import LabeledSection from '@/components/common/input/LabeledSection';
import TextInput from '@/components/common/input/TextInput';
import Modal from '@/components/common/modal/Modal';

const defaultStyle =
  'rounded-xl border border-solid border-mainGray px-6 py-[13px] text-lg';

interface FormValues {
  storeName: string;
  reason: string;
}

export default function StoreReportModal() {
  const { hideDialog, showToast } = useDialogContext();
  const methods = useForm<FormValues>({
    defaultValues: {
      storeName: '',
      reason: '',
    },
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
      onToggleClick={hideDialog}
      title={<div className="mb-4 text-2xl">맛집 제보하기</div>}
    >
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <div className="mt-10 flex w-[716px] flex-col gap-[82px]">
          <LabeledSection label="식당 이름">
            <Controller
              control={control}
              name="storeName"
              render={({ field: { onChange }, fieldState: { error } }) => {
                return (
                  <div className="flex flex-col">
                    <TextInput
                      placeholder="식당 이름을 입력해주세요"
                      className={`h-full ${defaultStyle} ${error && 'border-red-500'}`}
                      name="가게이름"
                      onChange={onChange}
                    />

                    {error && (
                      <ErrorMsg msg={error?.message || ''} className="ml-2" />
                    )}
                  </div>
                );
              }}
            />
          </LabeledSection>

          <LabeledSection label="맛집 추천 사유">
            <Controller
              control={control}
              name="storeName"
              render={({ field: { onChange }, fieldState: { error } }) => {
                return (
                  <div className="flex flex-col">
                    <TextInput
                      placeholder="맛집 추천 사유를 입력해주세요"
                      className={`h-full ${defaultStyle} ${error && 'border-red-500'}`}
                      name="맛집 추천 사유"
                      onChange={onChange}
                    />

                    {error && (
                      <ErrorMsg msg={error?.message || ''} className="ml-2" />
                    )}
                  </div>
                );
              }}
            />
          </LabeledSection>
        </div>

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
