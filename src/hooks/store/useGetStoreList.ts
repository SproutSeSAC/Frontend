import { useSearchParams } from 'react-router-dom';

import { useGetUserProfile } from '@/services/auth/authQueries';
import { useGetCampusList } from '@/services/campusCourse/campusCourseQueries';
import { useGetInfiniteStoreList } from '@/services/store/storeQueries';

import { Store } from '@/types/store/storeDto';
import { extractValidParams } from '@/utils';

export const useGetStoreList = () => {
  const { data: userProfile } = useGetUserProfile();

  const { data: campusList } = useGetCampusList();

  const [searchParams] = useSearchParams();
  const newSearchParams = extractValidParams(searchParams);

  const userCampusId = userProfile?.campusList[0].id;
  const currCampusId = +newSearchParams.campusId || userCampusId;
  const currCampus = campusList?.find(({ id }) => id === currCampusId);

  const {
    data = { pages: [{ stores: [], totalPages: 0 }], pageParams: [] },
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
  } = useGetInfiniteStoreList({ currCampusId });

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
    currCampus,
  };
};
