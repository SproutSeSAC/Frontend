import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import {
  useUpdateProfileImage,
  useUpdateUserProfile,
} from '@/services/auth/authMutations';

import { useDialogContext, useHandleImage } from '@/hooks';
import { UserProfileDto } from '@/types';
import { FormProvider, useForm } from 'react-hook-form';

import SquareButton from '@/components/common/button/SquareButton';
import CameraInput from '@/components/common/input/CameraInput';
import Label from '@/components/common/input/Label';
import TextInput from '@/components/common/input/TextInput';
import Modal from '@/components/common/modal/Modal';
import UserImage from '@/components/user/UserImage';

interface UserNameImageModalProps {
  profile: UserProfileDto.Get;
}

export default function UserNameImageModal({
  profile,
}: UserNameImageModalProps) {
  const [previewUrl, setPreviewUrl] = useState<string>();

  const queryClient = useQueryClient();

  const { hideDialog } = useDialogContext();

  const { nickname, profileImageUrl } = profile;

  const { mutateAsync: mutateProfile } = useUpdateUserProfile({
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['useGetUserProfile'],
      });
    },
  });

  const { mutateAsync: mutateProfileImage } = useUpdateProfileImage({
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['useGetUserProfile'],
      });
    },
  });

  const methods = useForm({
    defaultValues: { nickname, profileImageFiles: null },
  });

  const { handleSubmit, register } = methods;

  const {
    onImageChange,
    uploadImageToS3,
    extractImageNameFromUrl,
    deleteImageFromS3,
  } = useHandleImage();

  const resetProfileImage = async () => {
    if (profileImageUrl !== '') {
      deleteImageFromS3(profileImageUrl);
      await mutateProfileImage({ profileUrl: '' });
    }
  };

  const onSubmit = async (formData: {
    nickname: string;
    profileImageFiles: File[] | null;
  }) => {
    if (nickname !== formData.nickname) {
      await mutateProfile({ nickname: formData.nickname });
    }
    if (profileImageUrl !== '') {
      deleteImageFromS3(profileImageUrl);
    }
    const file = formData.profileImageFiles?.[0];
    if (file) {
      const fileName = `${Date.now()}.${file.type.split('/')[1]}`;
      const fileWithNewName = new File([file], fileName, { type: file.type });
      const s3Url = await uploadImageToS3(fileWithNewName);
      const imageName = extractImageNameFromUrl(s3Url);
      await mutateProfileImage({ profileUrl: imageName });
    }
    hideDialog('USERNAME-IMAGE-CARD-TYPE');
  };

  return (
    <Modal onToggleClick={hideDialog} title="개인정보" className="p-[50px]">
      <FormProvider {...methods}>
        <form
          className="mt-4 flex w-[350px] flex-col"
          onSubmit={handleSubmit(onSubmit)}
        >
          <UserImage
            previewUrl={previewUrl}
            imageNameSegment={previewUrl ? undefined : profileImageUrl}
            className="mx-auto mb-6 size-[220px] border shadow-card"
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

          <div className="mt-6 flex gap-4 self-end">
            <SquareButton
              type="button"
              name="기본 이미지 적용"
              onClick={resetProfileImage}
              className="bg-darkGray font-medium text-white"
            />
            <SquareButton
              type="submit"
              name="저장하기"
              className="font-medium text-white"
            />
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
}
