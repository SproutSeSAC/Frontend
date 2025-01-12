import { getByteSizeNum } from '@/utils/getByteSizeNum';

import { useDialogContext } from '@/hooks';
import { base64ToFile } from '@/utils';
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

    const { data } = await axios.post<PresignedUrlResponse>(
      `${import.meta.env.VITE_API_PRESIGNED_URL}/aws/uploadurl`,
      {
        bucketName: 'sprout-public-asset',
        objectKey,
        contentType: file.type,
        expirationMinutes: 1,
        ACL: 'bucket-owner-full-control',
      },
    );
    return data.presignedUrl;
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

  const extractImageSrcDataList = (
    htmlContent: string,
    dataType: 'base64' | 's3url',
  ) => {
    const base64ImageRegex =
      /<img[^>]*src="(data:image\/[^;]+;base64,[^"]+)"[^>]*>/g;
    const urlImageRegex = /<img[^>]*src="(https?:\/\/[^"]+)"[^>]*>/g;
    const regex = dataType === 'base64' ? base64ImageRegex : urlImageRegex;
    const matches = htmlContent ? [...htmlContent.matchAll(regex)] : [];
    const matchedImages = matches.map(match => match[1]);
    return matchedImages;
  };

  const extractImageNameFromUrl = (url: string): string => {
    const pathSegments = new URL(url).pathname.split('/');
    return pathSegments[pathSegments.length - 1];
  };

  const uploadImageToS3 = async (file: File) => {
    const presignedUrl = await getPresignedUrl(file);
    await axios.put(presignedUrl, file, {
      headers: {
        'Content-Type': file.type || 'application/octet-stream',
        'x-amz-acl': 'bucket-owner-full-control',
      },
    });
    const url = new URL(presignedUrl);
    return decodeURI(url.origin + url.pathname);
  };

  const deleteImageFromS3 = async (fileName: string) => {
    axios.delete(`${import.meta.env.VITE_API_PRESIGNED_URL}/aws/deletefile`, {
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
      data: {
        bucketName: 'sprout-public-asset',
        objectKey: `profile/${fileName}`,
      },
    });
  };

  const deletePostImages = async (
    currContent: string,
    prevContent?: string,
  ) => {
    const currS3UrlList = extractImageSrcDataList(currContent, 's3url');
    const currImageNameFromS3UrlList = currS3UrlList.map(url =>
      extractImageNameFromUrl(url),
    );
    if (prevContent) {
      const prevS3UrlImages = extractImageSrcDataList(prevContent, 's3url');
      const prevS3UrlImageNameList = prevS3UrlImages.map(url =>
        extractImageNameFromUrl(url),
      );
      const imageNameToDeleteList = prevS3UrlImageNameList.filter(
        name => !currImageNameFromS3UrlList.includes(name),
      );
      if (imageNameToDeleteList.length > 0) {
        await Promise.all(
          imageNameToDeleteList.map(async imageName => {
            deleteImageFromS3(imageName);
          }),
        );
      }
      return;
    }
    await Promise.all(
      currImageNameFromS3UrlList.map(async imageName => {
        deleteImageFromS3(imageName);
      }),
    );
  };

  const handleImagesInHtmlContent = async (
    currContent: string,
    prevContent?: string,
  ): Promise<string> => {
    const currBase64DataList = extractImageSrcDataList(currContent, 'base64');

    if (prevContent) {
      deletePostImages(currContent, prevContent);
    }

    const contentReplacedWithS3Url =
      currBase64DataList.length === 0
        ? currContent
        : await currBase64DataList.reduce(async (accPromise, base64Data) => {
            const acc = await accPromise;
            try {
              const file = base64ToFile(base64Data, `${Date.now()}`);
              const s3Url = await uploadImageToS3(file);
              return acc.replace(base64Data, s3Url);
            } catch (error) {
              return acc;
            }
          }, Promise.resolve(currContent));

    return contentReplacedWithS3Url;
  };

  return {
    extractImageNameFromUrl,
    getPresignedUrl,
    uploadImageToS3,
    deleteImageFromS3,
    onImageChange,
    deletePostImages,
    handleImagesInHtmlContent,
  };
};
