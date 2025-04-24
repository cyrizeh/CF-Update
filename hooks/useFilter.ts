import { useState } from 'react';

type Filters = {
  [key: string]: string;
};

export const useFilter = (filters: Filters) => {
  const initialData = { ...filters };
  const [tempFilters, setTempFilters] = useState({ ...initialData });
  const [actualFilters, setActualFilters] = useState({ ...initialData });

  const onChangeTemp = (filter: string, value: string) => {
    setTempFilters(prev => ({ ...prev, [filter]: value }));
  };

  const onSetFilters = () => setActualFilters(tempFilters);

  const isFiltering = JSON.stringify(actualFilters) !== JSON.stringify(initialData);

  const removeFilter = (filter: string) => {
    setTempFilters(prev => {
      setActualFilters({ ...prev, [filter]: '' });
      return { ...prev, [filter]: '' };
    });
  };

  const clearFilters = () => {
    setTempFilters(initialData);
    setActualFilters(initialData);
  };

  return { tempFilters, actualFilters, isFiltering, removeFilter, onChangeTemp, onSetFilters, clearFilters };
};
