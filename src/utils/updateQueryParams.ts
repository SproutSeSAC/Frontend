export const updateQueryParams = (
  searchParams: URLSearchParams,
  setSearchParams: (
    params: URLSearchParams,
    options?: { replace?: boolean },
  ) => void,
  key: string,
  value: string | string[],
) => {
  const params = new URLSearchParams(searchParams);

  if (typeof value === 'string') {
    params.set(key, value);
  } else if (Array.isArray(value) && value.length > 0) {
    params.set(key, value.join(','));
  } else {
    params.delete(key);
  }

  setSearchParams(params, { replace: true });
};
