import { useCallback, useRef, useState } from 'react';

export const useFilterData = <T>({ initialState }: { initialState: T }) => {
  const [currFilter, setCurrFilter] = useState<T>(initialState);

  const handleChangeFilter = useCallback((newData: Partial<T>) => {
    setCurrFilter(prev => ({ ...prev, ...newData }));
  }, []);

  const searchRef = useRef<HTMLInputElement | null>(null);

  const handleChangeKeyword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (searchRef.current) {
        searchRef.current.value = e.target.value;
      }
    },
    [],
  );

  const handleSearchSubmit = useCallback(() => {
    setCurrFilter(prev => ({ ...prev, keyWord: searchRef.current?.value }));
  }, []);

  const handleResetFilter = useCallback(() => {
    setCurrFilter(initialState);
  }, [initialState]);

  return {
    searchRef,
    currFilter,
    handleChangeKeyword,
    handleSearchSubmit,
    handleChangeFilter,
    handleResetFilter,
  };
};
