export function base64ToFile(base64Data: string, fileName: string) {
  const [metadata, base64String] = base64Data.split(',');
  const mimeType = metadata.match(/:(.*?);/)?.[1];

  const byteCharacters = atob(base64String);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
    const byteArray = [];
    for (let i = 0; i < 1024 && offset + i < byteCharacters.length; i += 1) {
      byteArray.push(byteCharacters.charCodeAt(offset + i));
    }
    byteArrays.push(new Uint8Array(byteArray));
  }

  const blob = new Blob(byteArrays, { type: mimeType });
  return new File([blob], fileName, { type: mimeType });
}
