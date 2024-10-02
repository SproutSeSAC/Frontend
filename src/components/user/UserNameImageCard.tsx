import { useUpdateUserProfile } from '@/services/auth/authMutations';

import { formCondition } from '@/constants';
import { useToggleModal } from '@/hooks';
import { UpdateableUserProfile } from '@/types';
import { FormProvider, useForm } from 'react-hook-form';

import CameraButton from '@/components/common/button/CameraButton';
import EditButton from '@/components/common/button/EditButton';
import SquareButton from '@/components/common/button/SquareButton';
import Label from '@/components/common/input/Label';
import TextInput from '@/components/common/input/TextInput';
import Modal from '@/components/common/modal/Modal';
import UserImage from '@/components/user/UserImage';

interface UserNameImageCardProps {
  name: string;
  nickname: string;
  profileImageUrl: string;
}

export default function UserNameImageCard({
  name,
  nickname,
  profileImageUrl,
}: UserNameImageCardProps) {
  const { modalOpen, toggleModal } = useToggleModal();

  const methods = useForm({
    defaultValues: { nickname },
  });

  const { handleSubmit, register } = methods;

  const { mutate } = useUpdateUserProfile({
    onSuccess: data => console.log('성공시', data),
  });

  const onSubmit = (formData: Partial<UpdateableUserProfile>) => {
    mutate(formData);
  };

  return (
    <>
      <div className="relative flex w-[45%] max-w-[305px] items-center gap-8 rounded-xl bg-oliveGreen1 px-6 py-10">
        <UserImage
          profileImageUrl={profileImageUrl}
          className="size-[100px] p-5"
        >
          <CameraButton onClick={() => {}} />
        </UserImage>

        <div className="flex flex-col gap-2">
          <span className="text-2xl font-medium text-white">{name}</span>
          <span className="text-oliveGreen3">{nickname}</span>
        </div>

        <EditButton
          label="프로필 수정 버튼"
          className="absolute right-3 top-3 text-white"
          onClick={toggleModal}
        />
      </div>

      {modalOpen && (
        <Modal onToggleClick={toggleModal} title="개인정보">
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
                {...register('nickname', { ...formCondition.nickname })}
              />

              <SquareButton
                type="submit"
                name="저장하기"
                className="mt-6 self-end font-semibold text-white"
              />
            </form>
          </FormProvider>
        </Modal>
      )}
    </>
  );
}
