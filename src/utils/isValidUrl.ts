export const isValidUrl = (url: string): boolean => {
  const pattern = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-]*)*$/;
  return pattern.test(url);
};
