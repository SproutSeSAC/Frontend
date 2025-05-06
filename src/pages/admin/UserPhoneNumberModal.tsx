import { useEffect } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { usePatchUserToManagePhoneNumber } from '@/services/admin/userToManageMutation';

import { useDialogContext } from '@/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';

import SquareButton from '@/components/common/button/SquareButton';
import ControllerPhoneNumber from '@/components/common/input/ControllerPhoneNumber';
import Modal from '@/components/common/modal/Modal';
import { formSchema } from '@/components/user/UserManagementItem';

interface UserPhoneNumberModalProps {
  userId: number;
  username: string;
  userPhoneNumber: string;
}

export default function UserPhoneNumberModal({
  userId,
  username,
  userPhoneNumber,
}: UserPhoneNumberModalProps) {
  const { hideDialog, showToast } = useDialogContext();

  const queryClient = useQueryClient();

  const methods = useForm({
    defaultValues: { phoneNumber: '' },
    resolver: zodResolver(formSchema),
  });

  const { handleSubmit, setValue } = methods;

  const { mutateAsync: changePhoneNumber } = usePatchUserToManagePhoneNumber({
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['useGetUserToManageInfo', userId],
      });
    },
  });

  useEffect(() => {
    setValue('phoneNumber', userPhoneNumber);
  }, [userPhoneNumber, setValue]);

  return (
    <Modal title="전화번호 수정" onClose={hideDialog} modalSize="md">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(({ phoneNumber }) => {
            if (phoneNumber !== userPhoneNumber) {
              changePhoneNumber({ userId, phoneNumber });
            }
            showToast('전화번호가 수정되었습니다!');
            return hideDialog();
          })}
          className="mt-[26px]"
        >
          <h4 className="mb-2 text-lg font-medium">
            <span className="text-mainGreen">{username}</span>님의 연락처
          </h4>
          <div className="flex items-start justify-between gap-4">
            <ControllerPhoneNumber
              name="phoneNumber"
              className="!rounded-xl bg-lightGray-active"
            />
            <SquareButton
              type="submit"
              name="확인"
              color="gray"
              className="h-[50px] min-w-fit !rounded-xl"
            />
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
}
