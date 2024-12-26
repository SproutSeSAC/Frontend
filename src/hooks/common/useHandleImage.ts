import { useDialogContext } from '@/hooks/common/useDialogContext';

import { getByteSizeNum } from '@/utils/getByteSizeNum';

import axios from 'axios';

type PresignedUrlResponse = {
  presignedUrl: string;
  expirationMinutes: number;
};

export const useHandleImage = () => {
  const { alert, hideDialog } = useDialogContext();

  const alertLimitCapacity = (limitCapacity: number) => {
    alert({
      text: `이미지는 ${limitCapacity}MB 이하만 업로드 가능합니다.`,
      buttonList: [
        {
          name: '확인',
          onClick: hideDialog,
        },
      ],
    });
  };

  const alertUnMatchFileType = () => {
    alert({
      text: '지원되지 않는 파일 형식입니다. 파일은 png, jpeg, jpg 타입만 업로드 가능합니다.',
      buttonList: [
        {
          name: '확인',
          onClick: hideDialog,
        },
      ],
    });
  };

  const getPresignedUrl = async (file: File) => {
    const folderPath = 'profile';
    const objectKey = `${folderPath}/${file?.name}`;

    const data = await axios.post<PresignedUrlResponse>(
      import.meta.env.VITE_API_PRESIGNED_URL,
      {
        bucketName: 'sprout-public-asset',
        objectKey,
        contentType: file.type,
        expirationMinutes: 1,
        ACL: 'bucket-owner-full-control',
      },
    );
    return data.data.presignedUrl;
  };

  const uploadImageToS3 = async (presignedUrl: string, file: File) => {
    await axios.put(presignedUrl, file, {
      headers: {
        'Content-Type': file.type || 'application/octet-stream',
        'x-amz-acl': 'bucket-owner-full-control',
      },
    });
  };

  const onImageChange = (
    file: File,
    limitCapacity: number,
    onloadFn: (result: string) => void,
  ) => {
    if (!file) return;

    if (file.size > getByteSizeNum(limitCapacity)) {
      alertLimitCapacity(limitCapacity);
      return;
    }
    if (
      file.type !== 'image/png' &&
      file.type !== 'image/jpeg' &&
      file.type !== 'image/jpg'
    ) {
      alertUnMatchFileType();
    }

    const reader = new FileReader();
    reader.onload = () => onloadFn(reader?.result as string);
    reader.readAsDataURL(file);
  };

  return {
    getPresignedUrl,
    uploadImageToS3,
    onImageChange,
  };
};
