import CustomPagination from './CustomPagination';
import { SizePerPage } from '@/constants/pagination';

import { isSmallScreen } from '@/utils';
import CustomSelect from '../Forms/Select/Select';

type Props = {
  size: number;
  totalPages: number;
  currentPage: number;
  // eslint-disable-next-line no-unused-vars
  onChangeSize: (size: number) => void;
  // eslint-disable-next-line no-unused-vars
  onPageChange: (page: number) => void;
};

const Pagination = ({ size, currentPage, totalPages, onPageChange, onChangeSize }: Props) => {
  return (
    <div className="mt-2 flex w-full items-center justify-center gap-2 text-center md:justify-end">
      {!isSmallScreen() && (
        <div className="flex items-center gap-2">
          <div className="text-sm text-white">Items per page:</div>
          <CustomSelect value={size} options={SizePerPage} onChange={(v: any) => onChangeSize(parseInt(v))} />
        </div>
      )}

      {totalPages > 1 && (
        <CustomPagination
          layout={!isSmallScreen() ? 'pagination' : 'table'}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default Pagination;
