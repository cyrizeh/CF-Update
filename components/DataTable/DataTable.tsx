import styles from './DataTable.module.css';
import { DataTableProps } from './DataTable.types';

export const DataTable = ({ headers, children }: DataTableProps) => {
  const thClass =
    'group-first/head:first:rounded-tl-lg whitespace-nowrap group-first/head:last:rounded-tr-lg bg-dark-grey-100 dark:bg-dark-grey-100 px-6 py-3 text-white font-normal text-sm text-left uppercase';

  return (
    <div className="block w-full overflow-x-auto">
      <table className={`w-full ${styles.data__table__table}`}>
        <thead>
          <tr>
            {!!headers.length &&
              headers.map((header: string, idx: number) => {
                return (
                  <th className={thClass} key={idx}>
                    {header}
                  </th>
                );
              })}
          </tr>
        </thead>
        {children}
      </table>
    </div>
  );
};
