import { usePostStoreReport } from '@/services/store/storeMutations';

import { useDialogContext } from '@/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitErrorHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import SquareButton from '@/components/common/button/SquareButton';
import ErrorMsg from '@/components/common/input/ErrorMsg';
import Modal from '@/components/common/modal/Modal';

interface FormValues {
  content: string;
}

const proposalFormSchema = z.object({
  content: z.union([
    z.string().min(1, '댓글을 작성해 주세요.'),
    z.undefined().refine(() => false, '댓글을 작성해 주세요.'),
  ]),
});

interface StoreProposalEditModalProps {
  storeName: string;
}

export default function StoreProposalEditModal({
  storeName,
}: StoreProposalEditModalProps) {
  const { hideDialog, showToast } = useDialogContext();

  const methods = useForm<FormValues>({
    defaultValues: {
      content: '',
    },
    resolver: zodResolver(proposalFormSchema),
  });

  const { control, handleSubmit } = methods;

  const { mutateAsync, isPending, isIdle } = usePostStoreReport();

  const hideModal = () => hideDialog('STORE-PROPOSAL-EDIT-MODAL-TYPE');

  const onSubmit = async ({ content }: FormValues) => {
    mutateAsync({ type: 'UPDATE', targetStoreName: storeName, content });
    hideModal();
    showToast('정보 수정을 요청했어요!', 1000);
  };

  const onError: SubmitErrorHandler<FormValues> = err => {
    const firstErrorMessage = Object.entries(err)?.[0]?.[1].message || '';
    if (firstErrorMessage) {
      showToast(firstErrorMessage);
    }
  };

  return (
    <Modal onClose={hideModal} title="정보 수정 제안하기">
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="flex flex-col"
      >
        <Controller
          control={control}
          name="content"
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
          className="mt-10 self-end px-16"
          disabled={isPending || !isIdle}
        />
      </form>
    </Modal>
  );
}
