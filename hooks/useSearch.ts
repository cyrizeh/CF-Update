import { useEffect, useMemo, useState } from 'react';
import _ from 'lodash';

export const useSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = useMemo(() => {
    return _.debounce(handleChange, 400);
  }, []);

  useEffect(() => {
    return () => {
      handleSearch.cancel();
    };
  });

  return { searchTerm, handleSearch };
};
