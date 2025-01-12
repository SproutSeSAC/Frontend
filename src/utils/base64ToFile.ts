export function base64ToFile(base64Data: string, fileName: string) {
  if (!base64Data.includes(',')) {
    throw new Error('Invalid base64 format: Missing metadata or base64 string');
  }

  const [metadata, base64String] = base64Data.split(',');
  const mimeType = metadata.match(/:(.*?);/)?.[1];

  if (!mimeType) {
    throw new Error('메타데이터 포맷이 유효하지 않습니다.');
  }
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(base64String)) {
    throw new Error('base64 데이터가 유효하지 않습니다.');
  }

  const byteCharacters = atob(base64String);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
    const byteArray = [];
    for (let i = 0; i < 1024 && offset + i < byteCharacters.length; i += 1) {
      byteArray.push(byteCharacters.charCodeAt(offset + i));
    }
    byteArrays.push(new Uint8Array(byteArray));
  }

  const extension = mimeType?.split('/')[0];
  const blob = new Blob(byteArrays, { type: mimeType });
  return new File([blob], `${fileName}.${extension}`, { type: mimeType });
}
