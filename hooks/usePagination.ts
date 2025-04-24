import { useState } from 'react';
import { ListResponse } from '@/types/api/Responses/ListResponse.type';

interface Props extends ListResponse {
  items?: any;
}

const usePagination = (props: Props | null, pageSize: number = 5) => {
  const [currentPage, changePage] = useState(1);
  const [size, changeSize] = useState(pageSize);

  const onPageChange = (page: number) => changePage(page);

  const onChangeSize = (size: number) => {
    changeSize(size);
    changePage(1);
  };

  return { size, currentPage, totalPages: props?.totalPages ?? 0, onPageChange, onChangeSize };
};

export default usePagination;
