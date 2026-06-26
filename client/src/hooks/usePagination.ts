import { useCallback, useMemo, useState } from 'react';

export function usePagination(initialPage = 1, initialPageSize = 12) {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalPages, setTotalPages] = useState(1);

  const goToPage = useCallback(
    (nextPage: number) => {
      setPage(Math.max(1, Math.min(nextPage, totalPages)));
    },
    [totalPages]
  );

  const nextPage = useCallback(() => {
    goToPage(page + 1);
  }, [goToPage, page]);

  const prevPage = useCallback(() => {
    goToPage(page - 1);
  }, [goToPage, page]);

  const reset = useCallback(() => {
    setPage(initialPage);
  }, [initialPage]);

  const pagination = useMemo(
    () => ({
      page,
      pageSize,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    }),
    [page, pageSize, totalPages]
  );

  return {
    ...pagination,
    setPage: goToPage,
    setPageSize,
    setTotalPages,
    nextPage,
    prevPage,
    reset,
  };
}
