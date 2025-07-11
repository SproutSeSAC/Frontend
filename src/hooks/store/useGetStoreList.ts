import { useGetUserProfile } from '@/services/auth/authQueries';
import { useGetInfiniteStoreList } from '@/services/store/storeQueries';

import { Store } from '@/types/store/storeDto';

export const useGetStoreList = () => {
  const { data: userProfile } = useGetUserProfile();

  const userCampusId = userProfile?.campusList[0].id;

  const {
    data = { pages: [{ stores: [], totalPages: 0 }], pageParams: [] },
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
  } = useGetInfiniteStoreList({ userCampusId });

  const excellentIndex = data?.pages.map(item => item.stores);

  const storeList = excellentIndex?.reduce<Store[]>((acc, arr) => {
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
