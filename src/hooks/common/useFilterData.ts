import { useCallback, useState } from 'react';

import { useDebounce } from '@/hooks/common/useDebounce';

export const useFilterData = <T>({ initialState }: { initialState: T }) => {
  const [currFilter, setCurrFilter] = useState<T>(initialState);

  const handleChangeFilter = useCallback((newData: Partial<T>) => {
    setCurrFilter(prev => ({ ...prev, ...newData }));
  }, []);

  const handleChangeKeyword = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newKeyword = event.target.value;
      setCurrFilter(prev => ({ ...prev, keyword: newKeyword }));
    },
    [],
  );

  const handleResetFilter = useCallback(() => {
    setCurrFilter(initialState);
  }, [initialState]);

  const handleResetKeyword = useCallback(() => {
    setCurrFilter(prev => ({ ...prev, keyword: '' }));
  }, []);

  const debouncedKeyword = useDebounce(
    (currFilter as { keyword: string }).keyword,
    700,
  );

  const debouncedFilter = {
    ...currFilter,
    keyword: debouncedKeyword,
  };

  return {
    currFilter,
    debouncedFilter,
    handleChangeKeyword,
    handleChangeFilter,
    handleResetFilter,
    handleResetKeyword,
  };
};
