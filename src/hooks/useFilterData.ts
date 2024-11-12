import { useCallback, useRef, useState } from 'react';

// 여기서 T를 어떻게 하지??
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
    setCurrFilter(prev => ({ ...prev, keyword: searchRef.current?.value }));
  }, []);

  return {
    searchRef,
    currFilter,
    handleChangeKeyword,
    handleSearchSubmit,
    handleChangeFilter,
  };
};
