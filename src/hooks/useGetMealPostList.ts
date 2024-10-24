import { useGetInfiniteMealPostList } from '@/services/store/storeQueries';

import { Content } from '@/types/store/storeMealPostDto';

const useGetMealPostList = () => {
  const {
    data = { pages: [{ content: [], totalPages: 0 }], pageParams: [] },
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
  } = useGetInfiniteMealPostList();

  const excellentIndex = data?.pages.map(item => item.content);

  const mealPostList = excellentIndex.reduce<Content[]>((acc, arr) => {
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
    mealPostList,
  };
};

export default useGetMealPostList;
