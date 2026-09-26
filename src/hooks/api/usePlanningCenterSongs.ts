import { useInfiniteQuery, type InfiniteData } from '@tanstack/react-query';
import PlanningCenterApi from '../../api/PlanningCenterApi';
import type { PcoSong } from '../../types';

export default function usePlanningCenterSongs(query?: string) {
  const {
    // Reading `pages` of the `[]` placeholder gives `undefined`, as a
    // `Partial<InfiniteData>` does.
    data = [] as Partial<InfiniteData<PcoSong[]>>,
    isLoading,
    isError,
    isSuccess,
    error,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery<PcoSong[], Error>({
    queryKey: ['planning-center-songs', query],
    queryFn: async ({ pageParam = 0 }: { pageParam?: number }) => {
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
