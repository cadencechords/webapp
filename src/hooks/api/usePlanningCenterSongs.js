import { useInfiniteQuery } from '@tanstack/react-query';
import PlanningCenterApi from '../../api/PlanningCenterApi';

export default function usePlanningCenterSongs(query) {
  const {
    data = [],
    isLoading,
    isError,
    isSuccess,
    error,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['planning-center-songs', query],
    queryFn: async ({ pageParam = 0 }) => {
      return (await PlanningCenterApi.getSongs(pageParam, query)).data;
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < 25) {
        return undefined;
      }

      return pages.length;
    },
  });

  return {
    data,
    isLoading,
    isError,
    isSuccess,
    error,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  };
}
