"use client";

import { useState, useMemo } from "react";

interface UseTableStateProps<T> {
  data: T[];
  searchFields?: (keyof T)[];
  filterFn?: (item: T, filters: Record<string, any>) => boolean;
}

export function useTableState<T extends Record<string, any>>({
  data,
  searchFields = [],
  filterFn,
}: UseTableStateProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const filteredData = useMemo(() => {
    let result = data;

    // Apply search
    if (searchQuery && searchFields.length > 0) {
      result = result.filter((item) =>
        searchFields.some((field) =>
          String(item[field]).toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Apply filters
    if (filterFn && Object.keys(filters).length > 0) {
      result = result.filter((item) => filterFn(item, filters));
    }

    return result;
  }, [data, searchQuery, filters, searchFields, filterFn]);

  return {
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    filteredData,
    isLoading,
    setIsLoading,
    isError,
    setIsError,
  };
}
