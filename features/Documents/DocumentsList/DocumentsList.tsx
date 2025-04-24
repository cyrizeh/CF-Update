import { IconButton } from '@mui/material';
import styles from '../../Patients/PatientsList/PatienstListTable.module.css';
import Checkbox from '@/components/Forms/Checkbox/Checkbox';
import _ from 'lodash';

import { FaSortAlphaDown } from 'react-icons/fa';
import { FaSortAlphaUp } from 'react-icons/fa';
import classNames from 'classnames';

export const DocumentsList = ({
  rows,
  columns,
  checkboxSelection,
  checkedIds,
  onCheck,
  onCheckAll,
  changeSort,
  sortBy,
}: any) => {
  const thClass =
    'whitespace-nowrap group-first/head:first:rounded-tl-lg group-first/head:last:rounded-tr-lg bg-dark-grey-100 dark:bg-dark-grey-100 px-6 py-3 text-white font-normal text-sm text-left uppercase';
  const bodyRowClass =
    'text-white whitespace-nowrap font-normal border-y border-y-dark-grey-200 dark:border-y dark:border-y-dark-grey-200 hover:bg-dark-grey-100 dark:hover:bg-dark-grey-100 text-sm';
  const bodyCellClass =
    'group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg px-6 py-7';

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
      <table className={`scrollbar w-full ${styles.patients__list__table}`}>
        <thead>
          <tr>
            {checkboxSelection ? (
              <th className={thClass}>
                <Checkbox checked={rows.length === checkedIds.length} onChange={onCheckAll} />
              </th>
            ) : null}

            {columns.map((column: any, index: number) => {
              return (
                <th className={thClass} key={index}>
                  <div className="flex items-center gap-3">
                    {column.headerName}
                    {column.sortable ? sortButton(column.field, changeSort) : null}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {!_.isEmpty(rows) &&
            rows.map((row: any) => (
              <tr className={bodyRowClass} key={row.id}>
                {checkboxSelection ? (
                  <td className={bodyCellClass}>
                    <Checkbox onChange={() => onCheck(`${row.id}`)} checked={checkedIds.includes(row.id)} />
                  </td>
                ) : null}

                {columns.map((column: any) => (
                  <td className={bodyCellClass} key={column.field}>
                    <div className={classNames('flex', { 'justify-center': column.align === 'center' })}>
                      {column?.renderCell ? column?.renderCell(row) : row[column.field] || '-'}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};
