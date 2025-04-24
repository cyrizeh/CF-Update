/* eslint-disable no-unused-vars */
import { IconButton } from '@mui/material';
import styles from '../../features/Patients/PatientsList/PatienstListTable.module.css';
import Checkbox from '@/components/Forms/Checkbox/Checkbox';
import _ from 'lodash';
import { Radio } from 'flowbite-react';

import { FaSortAlphaDown } from 'react-icons/fa';
import { FaSortAlphaUp } from 'react-icons/fa';
import classNames from 'classnames';
import { Spinner } from 'flowbite-react';

export type ColDefType = {
  field: string;
  headerName: string | null;
  align?: 'left' | 'right' | 'center';
  sortable?: boolean;
  renderCell?: (row: any) => any;
  renderHeader?: () => any;
  showNoDataFound?: boolean;
  wrapText?: boolean;
  sensitive?: boolean;
};

const DataGridTable = ({
  rows,
  columns,
  checkboxSelection,
  checkedIds,
  onCheck,
  onCheckAll,
  changeSort,
  isLoading,
  sortBy,
  isMulti = true,
  showNoDataFound = true,
}: any) => {
  const checkAllLength = rows?.reduce(
    (count: number, item: { processed: boolean }) => count + (!item.processed ? 1 : 0),
    0
  );
  const thClass =
    'whitespace-nowrap group-first/head:first:rounded-tl-lg group-first/head:last:rounded-tr-lg bg-dark-grey-100 dark:bg-dark-grey-100 px-6 py-3 text-white font-normal text-sm text-left uppercase';

  const bodyCellClass =
    'group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg px-6 py-7 ';

  const sortButton = (sortKey: string, handleSort: any) => {
    const sortData = sortBy.split(':');

    const handleIcon = () => {
      if (!sortBy) {
        return <FaSortAlphaDown className="opacity-20" />;
      } else if (sortKey.toLowerCase() === sortData[0].toLowerCase() && sortData[1] === 'desc') {
        return <FaSortAlphaUp onClick={() => handleSort(sortKey)} />;
      } else if (sortKey.toLowerCase() === sortData[0].toLowerCase() && sortData[1] === 'asc') {
        return <FaSortAlphaDown onClick={() => handleSort(sortKey)} />;
      } else return <FaSortAlphaDown className="opacity-20" onClick={() => handleSort(sortKey)} />;
    };

    return (
      <IconButton size="small" onClick={() => handleSort(sortKey)} className="text-white" sx={{ color: 'white' }}>
        {handleIcon()}
      </IconButton>
    );
  };

  return (
    <div className="scrollbar block w-full overflow-hidden overflow-x-auto">
      {isLoading && _.isEmpty(rows) && (
        <div className="flex h-[385px] w-full items-center justify-center rounded-lg	bg-black/10 backdrop-blur-sm">
          <div className="flex items-center justify-center gap-2 text-sm text-white">
            <Spinner size="sm" className="mt-[-1px]" /> Loading...
          </div>
        </div>
      )}

      {!isLoading && _.isEmpty(rows) && showNoDataFound && (
        <div className="flex  h-[385px] w-full items-center justify-center rounded-lg bg-black/10 text-sm	text-sm text-white backdrop-blur-sm">
          No data found
        </div>
      )}

      {!_.isEmpty(rows) && (
        <table className={`scrollbar w-full ${styles.patients__list__table}`}>
          <thead>
            <tr>
              {checkboxSelection && isMulti ? (
                <th className={thClass}>
                  <Checkbox
                    checked={checkAllLength === checkedIds?.length && checkedIds?.length > 0}
                    onChange={onCheckAll}
                    disabled={rows.every((row: any) => row.processed)}
                  />
                </th>
              ) : !isMulti ? (
                <th className={thClass}></th>
              ) : null}

              {columns.map((column: any, index: number) => {
                return (
                  column.headerName && (
                    <th className={thClass} key={index}>
                      <div className="flex items-center gap-3">
                        {column?.renderHeader ? column?.renderHeader() : column.headerName}
                        {column.sortable ? sortButton(column.field, changeSort) : null}
                      </div>
                    </th>
                  )
                );
              })}
            </tr>
          </thead>

          <tbody className="relative">
            {isLoading && (
              <div className="absolute z-20 flex h-full w-full items-center justify-center rounded-lg	bg-black/10 backdrop-blur-sm">
                <div className="flex items-center justify-center gap-2 text-sm text-white">
                  <Spinner size="sm" className="mt-[-1px]" /> Loading...
                </div>
              </div>
            )}

            {!_.isEmpty(rows) &&
              rows.map((row: any) => (
                <tr
                  className={`${
                    row.processed ? 'text-gray-500' : 'text-white'
                  } whitespace-nowrap border-y border-y-dark-grey-200 text-sm font-normal hover:bg-dark-grey-100 dark:border-y dark:border-y-dark-grey-200 dark:hover:bg-dark-grey-100`}
                  key={row.id}>
                  {checkboxSelection && isMulti ? (
                    <td className={bodyCellClass}>
                      <Checkbox
                        onChange={() => onCheck(`${row.id}`)}
                        disabled={row.processed}
                        checked={checkedIds?.includes(row.id)}
                      />
                    </td>
                  ) : !isMulti ? (
                    <td className={bodyCellClass}>
                      <Radio
                        id={row.id}
                        onClick={() => onCheck(`${row.id}`)}
                        checked={checkedIds?.includes(row.id)}
                        style={{ boxShadow: 'none' }}
                        className="cursor-pointer"
                      />
                    </td>
                  ) : null}

                  {columns.map(
                    (column: any) =>
                      column.headerName && (
                        <td className={bodyCellClass} key={column.field}>
                          <div
                            className={classNames('mr-2 flex max-w-[250px] truncate', {
                              'justify-center': column.align === 'center',
                              'justify-end': column.align === 'right',
                              'max-w-[220px] items-center gap-2 overflow-hidden whitespace-pre-wrap':
                                column.wrapText === true,
                              sensitive: column.sensitive, // Added 'sensitive' to mask users data
                            })}>
                            {column?.renderCell ? column?.renderCell(row) : row[column.field] || '-'}
                          </div>
                        </td>
                      )
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DataGridTable;
