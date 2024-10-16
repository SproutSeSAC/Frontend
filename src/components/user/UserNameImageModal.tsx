import { UseMutateFunction } from '@tanstack/react-query';

import { useDialogContext } from '@/hooks';
import { UpdateableUserProfile } from '@/types';
import { FormProvider, useForm } from 'react-hook-form';

import CameraButton from '@/components/common/button/CameraButton';
import SquareButton from '@/components/common/button/SquareButton';
import Label from '@/components/common/input/Label';
import TextInput from '@/components/common/input/TextInput';
import Modal from '@/components/common/modal/Modal';
import UserImage from '@/components/user/UserImage';

export default function UserNameImageModal({
  nickname,
  mutate,
}: {
  nickname: string;
  mutate: UseMutateFunction<
    unknown,
    Error,
    Partial<UpdateableUserProfile>,
    unknown
  >;
}) {
  const { hideDialog } = useDialogContext();

  const methods = useForm({
    defaultValues: { nickname },
  });

  const { handleSubmit, register } = methods;

  const onSubmit = (formData: Partial<UpdateableUserProfile>) => {
    mutate(formData);
  };

  return (
    <Modal onToggleClick={hideDialog} title="개인정보">
      <FormProvider {...methods}>
        <form
          className="flex w-[350px] flex-col"
          onSubmit={handleSubmit(onSubmit)}
        >
          <UserImage className="mx-auto mb-6 size-[220px] p-10">
            <CameraButton
              onClick={() => {}}
              className="bottom-5 right-3"
              iconSize={6}
            />
          </UserImage>

          <Label htmlFor="별명" />
          <TextInput
            placeholder={nickname}
            className="h-[50px] w-full pl-4"
            {...register('nickname')}
          />

          <SquareButton
            type="submit"
            name="저장하기"
            className="mt-6 self-end font-semibold text-white"
          />
        </form>
      </FormProvider>
    </Modal>
  );
}
