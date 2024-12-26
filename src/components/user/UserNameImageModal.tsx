import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import {
  useUpdateProfileImage,
  useUpdateUserProfile,
} from '@/services/auth/authMutations';
import {
  initialUserProfile,
  useGetUserProfile,
} from '@/services/auth/authQueries';

import { useDialogContext, useHandleImage } from '@/hooks';
import { FormProvider, useForm } from 'react-hook-form';

import SquareButton from '@/components/common/button/SquareButton';
import CameraInput from '@/components/common/input/CameraInput';
import Label from '@/components/common/input/Label';
import TextInput from '@/components/common/input/TextInput';
import Modal from '@/components/common/modal/Modal';
import UserImage from '@/components/user/UserImage';

export default function UserNameImageModal() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { hideDialog } = useDialogContext();

  const { data: { nickname } = initialUserProfile } = useGetUserProfile();

  const { mutateAsync: mutateProfile } = useUpdateUserProfile({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['useGetUserProfile'] });
    },
  });

  const { mutateAsync: mutateProfileImage } = useUpdateProfileImage();

  const methods = useForm({
    defaultValues: { nickname, profileImageFiles: null },
  });

  const { handleSubmit, register } = methods;

  const { getPresignedUrl, uploadImageToS3, onImageChange } = useHandleImage();

  const onSubmit = async (formData: {
    nickname: string;
    profileImageFiles: File[] | null;
  }) => {
    if (nickname !== formData.nickname) {
      await mutateProfile({ nickname: formData.nickname });
    }
    const file = formData.profileImageFiles?.[0];
    if (file) {
      const presignedUrl = await getPresignedUrl(file);
      await uploadImageToS3(presignedUrl, file);
      await mutateProfileImage({ profileUrl: presignedUrl });
    }
    hideDialog('USERNAME-IMAGE-CARD-TYPE');
  };

  return (
    <Modal onToggleClick={hideDialog} title="개인정보" className="p-4">
      <FormProvider {...methods}>
        <form
          className="flex w-[350px] flex-col"
          onSubmit={handleSubmit(onSubmit)}
        >
          <UserImage
            imgUrl={previewUrl || ''}
            className="mx-auto mb-6 size-[220px]"
          >
            <CameraInput
              onChange={async event => {
                if (!event?.target?.files?.[0]) return;
                onImageChange(event?.target?.files?.[0], 5, setPreviewUrl);
              }}
              className="bottom-5 right-2"
              iconSize={6}
            />
          </UserImage>

          <Label htmlFor="별명" className="mb-1 ml-2" />
          <TextInput
            placeholder="별명을 수정해주세요"
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
