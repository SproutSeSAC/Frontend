export const getCookie = (name: string) => {
  const cookies = Object.fromEntries(
    document.cookie.split(';').map(cookie => cookie.trim().split('=')),
  );

  return cookies[name];
};

export const setCookie = (name: string, value: string, day: number) => {
  const date = new Date();
  date.setDate(date.getTime() + day * 60 * 60 * 24 * 1000);

  document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
};

export const deleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
};
