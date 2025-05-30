import { usePatchUserToManagePhoneNumber } from '@/services/admin/userToManageMutation';

import { useDialogContext } from '@/hooks';
import { UserManagementDto } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';

import { phoneSchema } from '@/components/admin/form/PhoneSchema';
import SquareButton from '@/components/common/button/SquareButton';
import ControllerPhoneNumber from '@/components/common/input/ControllerPhoneNumber';

interface UserManagementPhoneNumberProps {
  user: UserManagementDto.GetUserList['content'][number];
  onMenuClose: () => void;
}

export default function UserManagementPhoneNumber({
  user,
  onMenuClose,
}: UserManagementPhoneNumberProps) {
  const { name: userName, userId, phoneNumber } = user;

  const methods = useForm({
    defaultValues: { phoneNumber },
    resolver: zodResolver(phoneSchema),
  });

  const { handleSubmit } = methods;

  const { mutateAsync: changePhoneNumber } = usePatchUserToManagePhoneNumber();

  const { showToast } = useDialogContext();

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(({ phoneNumber: phoneNum }) => {
          if (phoneNum !== phoneNumber) {
            changePhoneNumber({ userId, phoneNumber: phoneNum });
          }
          showToast('전화번호가 수정되었습니다!');
          return onMenuClose();
        })}
        className="mt-[26px]"
      >
        <div className="mb-2 text-lg font-medium">
          <span className="text-mainGreen">{userName}</span>
          님의 연락처
        </div>
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
  );
}
