import { FilterType } from '@/types/view/Filters.type';
import _ from 'lodash';
import { useEffect, useMemo, useState } from 'react';

type Filters = {
  [key: string]: FilterType;
};

export const useTableControls = (list: any, filters: Filters, pageSize: number = 10, showDefault: boolean=false) => {
  const initialData = { ...filters };
  // Search data:
  const [searchTerm, setSearchTerm] = useState('');
  // Pagination data:
  const [currentPage, changePage] = useState(1);
  const [size, changeSize] = useState(pageSize);
  // Filters data:
  const [tempFilters, setTempFilters] = useState({ ...initialData });
  const [actualFilters, setActualFilters] = useState({ ...initialData });
  // Sort data:
  const [dataSort, setDataSort] = useState('');

  // Pagination funcs:
  const onPageChange = (page: number) => changePage(page);

  const onChangeSize = (size: number) => {
    changeSize(size);
    changePage(1);
  };

  // Filters funcs:
  const onChangeTemp = (filter: string, value: string) => {
    setTempFilters(prev => ({ ...prev, [filter]: value }));
  };

  const onSetFilters = () => {
    setActualFilters(tempFilters);
    changePage(1);
  };

  const isFiltering = showDefault || JSON.stringify(actualFilters) !== JSON.stringify(initialData);

  const removeFilter = (filter: string) => {
    setTempFilters(prev => {
      setActualFilters({ ...prev, [filter]: '' });
      changePage(1);
      return { ...prev, [filter]: '' };
    });
  };

  const clearFilters = () => {
    changePage(1);
    setTempFilters(initialData);
    setActualFilters(initialData);
  };

  // Search funcs:
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    changePage(1);
  };

  const handleSearch = useMemo(() => {
    return _.debounce(handleChange, 400);
  }, []);

  useEffect(() => {
    return () => {
      handleSearch.cancel();
    };
  });

  // Sort funcs:
  const changeSort = (str: string) => {
    const [, type] = dataSort.split(':');
    if (type === 'desc') {
      return setDataSort(`${str}:asc`);
    }
    return setDataSort(`${str}:desc`);
  };

  return {
    sort: { dataSort, changeSort },
    search: { searchTerm, handleSearch },
    pagination: {
      size,
      currentPage,
      totalPages: list?.totalPages ?? 0,
      onPageChange,
      onChangeSize,
    },
    filters: {
      tempFilters,
      actualFilters,
      isFiltering,
      removeFilter,
      onChangeTemp,
      onSetFilters,
      clearFilters,
      setActualFilters,
    },
  };
};
