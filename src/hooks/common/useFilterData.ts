import { useCallback, useState } from 'react';

import { useDebounce } from '@/hooks';

export const useFilterData = <T>({ initialFilter }: { initialFilter: T }) => {
  const [currFilter, setCurrFilter] = useState<T>(initialFilter);

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
    setCurrFilter(initialFilter);
  }, [initialFilter]);

  const handleResetKeyword = useCallback(() => {
    setCurrFilter(prev => ({ ...prev, keyword: '' }));
  }, []);

  const debouncedKeyword = useDebounce(
    (currFilter as { keyword: string }).keyword,
    1000,
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
