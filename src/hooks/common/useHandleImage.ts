import { axiosInstance } from '@/services/axiosInstance';

import { useDialogContext } from '@/hooks';
import { base64ToFile, getByteSizeNum } from '@/utils';
import axios from 'axios';

// type PresignedUrlResponse = {
//   presignedUrl: string;
//   expirationMinutes: number;
// };

type SasUrlResponse = {
  sasUrl: string;
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

  const getSasUrl = async (file: File) => {
    const folderPath = 'profile';
    const blobName = `${folderPath}/${file?.name}`;

    // 변경: API 경로 및 요청 DTO 수정
    const { data } = await axiosInstance.post<SasUrlResponse>(
      `azure/uploadurl`,
      {
        containerName: 'sprout-public-asset',
        blobName,
        expirationMinutes: 1,
      },
    );
    return data.sasUrl;
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

  const uploadImageToBlobStorage = async (file: File) => {
    const sasUrl = await getSasUrl(file);

    await axios.put(sasUrl, file, {
      headers: {
        'Content-Type': file.type,
        'x-ms-blob-type': 'BlockBlob',
      },
    });

    const url = new URL(sasUrl);
    return decodeURI(url.origin + url.pathname);
  };

  const deleteImageFromBlobStorage = async (fileName: string) => {
    axiosInstance.delete('azure/deletefile', {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        containerName: 'sprout-public-asset',
        blobName: `profile/${fileName}`,
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
            deleteImageFromBlobStorage(imageName);
          }),
        );
      }
      return;
    }
    await Promise.all(
      currImageNameFromS3UrlList.map(async imageName => {
        deleteImageFromBlobStorage(imageName);
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
              const s3Url = await uploadImageToBlobStorage(file);
              return acc.replace(base64Data, s3Url);
            } catch (error) {
              return acc;
            }
          }, Promise.resolve(currContent));

    return contentReplacedWithS3Url;
  };

  return {
    extractImageNameFromUrl,
    uploadImageToBlobStorage,
    deleteImageFromBlobStorage,
    onImageChange,
    deletePostImages,
    handleImagesInHtmlContent,
  };
};
