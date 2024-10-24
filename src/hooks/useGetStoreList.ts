import { useGetCampusList } from '@/services/course/courseQueries';
import { useGetInfiniteStoreList } from '@/services/store/storeQueries';

import { Store } from '@/types/store/storeDto';

const useGetStoreList = () => {
  const { data: campusList } = useGetCampusList();

  const campusId = campusList ? campusList[0]?.id : 0;
  const {
    data = { pages: [{ storeList: [], totalPages: 0 }], pageParams: [] },
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
  } = useGetInfiniteStoreList(campusId);

  const excellentIndex = data?.pages.map(item => item.storeList);

  const storeList = excellentIndex.reduce<Store[]>((acc, arr) => {
    arr?.forEach(obj => {
      acc.push(obj);
    });

    return acc;
  }, []);

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetching,
    storeList,
  };
};

export default useGetStoreList;
