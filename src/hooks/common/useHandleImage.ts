import { useCallback } from 'react';

import { useDialogContext } from '@/hooks/common/useDialogContext';

import axios from 'axios';

type PresignedUrlResponse = {
  presignedUrl: string; // URL입니다.
  expirationMinutes: number; // 만료 시간입니다.
};

export const useHandleImage = () => {
  const { alert, hideDialog } = useDialogContext();

  const alertLimitCapacity = useCallback(
    ({ limitCapacity }: { limitCapacity: string }) => {
      alert({
        text: `이미지는 ${limitCapacity} 이하만 업로드 가능합니다.`,
        buttonList: [
          {
            name: '확인',
            onClick: hideDialog,
          },
        ],
      });
    },
    [alert, hideDialog],
  );

  const getPresignedUrl = async ({ file }: { file: File }) => {
    const folderPath = 'profile'; // 고정입니다.
    const objectKey = `${folderPath}/${file?.name}`; // profile/파일이름

    const data = await axios.post<PresignedUrlResponse>(
      import.meta.env.VITE_API_PRESIGNED_URL,
      {
        bucketName: 'sprout-public-asset',
        objectKey,
        contentType: file?.type, // 파일 확장자
        expirationMinutes: 1,
        ACL: 'bucket-owner-full-control',
      },
    );
    return data;
  };

  const uploadImageToS3 = async ({
    presignedUrl,
    file,
  }: {
    presignedUrl: string;
    file: File;
  }) => {
    await axios.put(presignedUrl, file, {
      headers: {
        'Content-Type': file.type || 'application/octet-stream',
        'x-amz-acl': 'bucket-owner-full-control', // 고정입니다.
      },
    });
  };

  const base64ToFile = (base64String: string): File => {
    const [header, data] = base64String.split(',');
    const mime = header.match(/:(.*?);/)?.[1];
    const bstr = atob(data);
    const n = bstr.length;
    const u8arr = new Uint8Array(n);

    for (let i = 0; i < n; i += 1) {
      u8arr[i] = bstr.charCodeAt(i);
    }

    return new File([u8arr], 'image.png', { type: mime });
  };

  return {
    alertLimitCapacity,
    getPresignedUrl,
    uploadImageToS3,
    base64ToFile,
  };
};
