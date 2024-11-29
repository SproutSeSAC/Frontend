import { useGetInfiniteMealPostList } from '@/services/store/storeQueries';

import { MealPosts } from '@/types/store/storeMealPostDto';

const useGetMealPostList = () => {
  const {
    data = { pages: [{ mealPosts: [], totalPages: 0 }], pageParams: [] },
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
  } = useGetInfiniteMealPostList();

  const excellentIndex = data?.pages.map(item => item.mealPosts);

  const mealPostList = excellentIndex.reduce<MealPosts[]>((acc, arr) => {
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
