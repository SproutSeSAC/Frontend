import { usePostStoreReport } from '@/services/store/storeMutations';

import { useDialogContext } from '@/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitErrorHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import SquareButton from '@/components/common/button/SquareButton';
import ErrorMsg from '@/components/common/input/ErrorMsg';
import LabeledSection from '@/components/common/input/LabeledSection';
import TextInput from '@/components/common/input/TextInput';
import Modal from '@/components/common/modal/Modal';

interface FormValues {
  targetStoreName: string;
  content: string;
}

const reportFormSchema = z.object({
  targetStoreName: z.union([
    z.string().min(1, '내용을 작성해 주세요.'),
    z.undefined().refine(() => false, '내용을 작성해 주세요.'),
  ]),
  content: z.union([
    z.string().min(1, '내용을 작성해 주세요.'),
    z.undefined().refine(() => false, '내용을 작성해 주세요.'),
  ]),
});

export default function StoreReportModal() {
  const { hideDialog, showToast } = useDialogContext();

  const { mutateAsync, isPending, isIdle } = usePostStoreReport();

  const methods = useForm<FormValues>({
    defaultValues: {
      targetStoreName: '',
      content: '',
    },
    resolver: zodResolver(reportFormSchema),
  });
  const { control, handleSubmit } = methods;

  const onSubmit = async ({ targetStoreName, content }: FormValues) => {
    mutateAsync({ type: 'ADD', targetStoreName, content });
    hideDialog();
    showToast('맛집을 제보했어요!', 1000);
  };

  const onError: SubmitErrorHandler<FormValues> = err => {
    const firstErrorMessage = Object.entries(err)?.[0]?.[1].message || '';
    if (firstErrorMessage) {
      showToast(firstErrorMessage);
    }
  };

  return (
    <Modal onClose={hideDialog} title="맛집 제보하기" zIndex={200}>
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="flex flex-col gap-10"
      >
        <LabeledSection label="식당 이름" className="mt-4">
          <Controller
            control={control}
            name="targetStoreName"
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
            name="content"
            render={({ field: { onChange }, fieldState: { error } }) => {
              return (
                <div className="flex flex-col">
                  <textarea
                    className={`w-full resize-none rounded-xl border px-4 py-3 placeholder:text-mainGray-hover focus:outline-none ${error ? 'border-[#FF3939]' : 'border-mainGray'}`}
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

        <SquareButton
          name="제보하기"
          type="submit"
          className="mt-5 self-end px-16"
          disabled={isPending || !isIdle}
        />
      </form>
    </Modal>
  );
}
