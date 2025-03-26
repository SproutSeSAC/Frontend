import { useCallback } from 'react';

import { useDialogContext } from '@/hooks';
import { Controller, SubmitErrorHandler, useForm } from 'react-hook-form';

import SquareButton from '@/components/common/button/SquareButton';
import ErrorMsg from '@/components/common/input/ErrorMsg';
import LabeledSection from '@/components/common/input/LabeledSection';
import TextInput from '@/components/common/input/TextInput';
import Modal from '@/components/common/modal/Modal';

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
      className="w-1/2 min-w-[300px] max-w-[600px] p-[50px]"
      onToggleClick={hideDialog}
      title={<div className="text-2xl">맛집 제보하기</div>}
    >
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="flex flex-col gap-10"
      >
        <LabeledSection label="식당 이름" className="mt-10">
          <Controller
            control={control}
            name="storeName"
            render={({ field: { onChange }, fieldState: { error } }) => {
              return (
                <TextInput
                  placeholder="식당 이름을 입력해주세요"
                  className="!px-4"
                  name="가게이름"
                  onChange={onChange}
                  errorMsg={error?.message}
                />
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
                  <textarea
                    className={`mt-2 w-full resize-none rounded-xl border px-4 py-3 placeholder:text-mainGray-hover focus:outline-none ${error ? 'border-[#FF3939]' : 'border-mainGray'}`}
                    placeholder="맛집 추천 사유를 입력해주세요"
                    rows={5}
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

        <SquareButton name="제보하기" type="submit" className="mt-5 self-end" />
      </form>
    </Modal>
  );
}
