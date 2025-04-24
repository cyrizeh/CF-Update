import classNames from 'classnames';
import type { ComponentProps, FC, ReactNode } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { twMerge } from 'tailwind-merge';

interface PaginationProps extends ComponentProps<'nav'> {
  currentPage: number;
  layout?: 'navigation' | 'pagination' | 'table';
  nextLabel?: string;
  // eslint-disable-next-line no-unused-vars
  onPageChange: (page: number) => void;
  previousLabel?: string;
  showIcons?: boolean;
  totalPages: number;
}

interface PaginationNavigationProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const CustomPagination: FC<PaginationProps> = ({
  className,
  currentPage,
  layout = 'pagination',
  nextLabel = 'Next',
  onPageChange,
  previousLabel = 'Previous',
  showIcons = false,
  totalPages,
  ...props
}) => {
  const lastPage = Math.min(
    Math.max(currentPage + (layout === 'pagination' ? 2 : 4), 5),
    layout === 'pagination' ? totalPages - 1 : totalPages
  );
  const firstPage = Math.max(layout === 'pagination' ? 2 : 1, lastPage - 4);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  // Helper function to create a range of numbers
  const range = (start: number, end: number) => Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <nav className={twMerge(className)} {...props}>
      {layout === 'table' && (
        <div className="text-sm text-gray-700 dark:text-gray-400">
          Showing <span className="font-semibold text-gray-900 dark:text-white">{currentPage}</span>
          {'  of '} <span className="font-semibold text-gray-900 dark:text-white">{totalPages}</span> Entries
        </div>
      )}
      <ul className="flex space-x-2">
        <li>
          <PaginationNavigation
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className={classNames(
              'rounded-l-lg bg-white px-3 py-2 text-sm text-gray-500 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:bg-transparent dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white',
              {
                'cursor-normal opacity-50': currentPage === 1,
              }
            )}>
            <div className="flex items-center gap-1">
              {showIcons && <HiChevronLeft aria-hidden />}
              {previousLabel}
            </div>
          </PaginationNavigation>
        </li>
        {layout === 'pagination' && (
          <>
            <PageButton page={1} isActive={currentPage === 1} onClick={() => onPageChange(1)} />
            {range(firstPage, lastPage).map(page => (
              <PageButton key={page} page={page} isActive={currentPage === page} onClick={() => onPageChange(page)} />
            ))}
            <PageButton
              page={totalPages}
              isActive={currentPage === totalPages}
              onClick={() => onPageChange(totalPages)}
            />
          </>
        )}
        <li>
          <PaginationNavigation
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={classNames(
              'rounded-r-lg bg-white px-3 py-2 text-sm text-gray-500 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:bg-transparent dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white',
              {
                'cursor-normal opacity-50': currentPage === totalPages,
              }
            )}>
            <div className="flex items-center gap-1">
              {nextLabel}
              {showIcons && <HiChevronRight aria-hidden />}
            </div>
          </PaginationNavigation>
        </li>
      </ul>
    </nav>
  );
};

const PageButton: FC<{ page: number; isActive: boolean; onClick: () => void }> = ({ page, isActive, onClick }) => (
  <li>
    <button
      type="button"
      className={classNames(
        'mr-1 w-10 rounded-md bg-white py-2 text-sm leading-tight text-gray-500 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:bg-transparent dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white',
        {
          'bg-cyan-50 bg-gradient-to-r from-cryo-blue to-cryo-cyan text-cyan-600 hover:bg-cyan-100 hover:text-cyan-700 dark:bg-gray-700 dark:text-white':
            isActive,
        }
      )}
      onClick={onClick}>
      {page}
    </button>
  </li>
);

const PaginationNavigation: FC<PaginationNavigationProps> = ({
  children,
  className,
  onClick,
  disabled = false,
  ...props
}) => {
  return (
    <button
      type="button"
      className={twMerge(disabled ? 'disabled cursor-not-allowed' : '', className)}
      disabled={disabled}
      onClick={onClick}
      {...props}>
      {children}
    </button>
  );
};

export default CustomPagination;
