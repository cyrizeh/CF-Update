/* eslint-disable no-unused-vars */
import _ from 'lodash';
import dayjs from 'dayjs';
import Link from 'next/link';

import Checkbox from '@/components/Forms/Checkbox/Checkbox';

import { useScreenWidth } from '@/hooks';
import { Accordion } from 'flowbite-react';

import { FaSortAlphaDown } from 'react-icons/fa';
import { FaSortAlphaUp } from 'react-icons/fa';

export type TableConfigType = {
  header: string;
  dataKey: Array<string>;

  type?: 'date' | 'link' | 'budge';
  sort?: any;
  link?: string;
  mobileLeft?: boolean;
  mobileRight?: boolean;
  customView?: (value: any) => any;
};

type TableProps = {
  tableConfig: Array<TableConfigType>;
  data: any;
  sorted: string;
  onCheck: any;
  onCheckAll: any;
  checkedIds?: any;
};

const CustomTable = ({ tableConfig, data, sorted, onCheck, onCheckAll, checkedIds }: TableProps) => {
  const { isSmallScreen } = useScreenWidth();

  const thClass =
    ' whitespace-nowrap group-first/head:first:rounded-tl-lg group-first/head:last:rounded-tr-lg bg-dark-grey-100 dark:bg-dark-grey-100 px-6 py-3 text-white font-normal text-sm text-left uppercase text-white text-sm font-normal uppercase leading-[21px]';
  const bodyRowClass =
    ' text-white whitespace-nowrap font-normal border-y border-y-dark-grey-200 dark:border-y dark:border-y-dark-grey-200 hover:bg-dark-grey-100 dark:hover:bg-dark-grey-100 text-sm';
  const bodyCellClass =
    ' group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg px-6 py-7 ';

  const handleSort = (sort: any, field: string) => {
    const sortedField: Array<string> = field.toLowerCase().split(':');

    if (sortedField.some(el => el === sort.key.toLowerCase())) {
      switch (sortedField[1]) {
        case 'asc':
          return <FaSortAlphaDown />;
        case 'desc':
          return <FaSortAlphaUp />;
        default:
          return <FaSortAlphaDown className="opacity-30" />;
      }
    } else return <FaSortAlphaDown className="opacity-30" />;
  };

  const handleType = (type: any, data: any, rowConfig: TableConfigType) => {
    switch (type) {
      case 'date':
        return data[0] ? dayjs(data[0]).format('MM/DD/YYYY') : '-';
      case 'link':
        return (
          <Link href={rowConfig?.link?.replace(':id', data[0]) || ''}>
            <div className="flex items-center gap-2 ">
              <span className="hover:underline">{data[1]}</span>
            </div>
          </Link>
        );
    }
  };

  const handleRowView = (rowConfig: TableConfigType, rowData: any) => {
    const { dataKey, customView, type } = rowConfig;

    if (dataKey.length > 1 && customView) {
      return customView(dataKey.map(key => _.get(rowData, key)));
    } else if (dataKey.length > 1 && type) {
      return handleType(
        type,
        dataKey.map(key => _.get(rowData, key)),
        rowConfig
      );
    } else {
      if (dataKey[0] === 'Checkbox') {
        return (
          <Checkbox checked={checkedIds && checkedIds.includes(rowData.id)} onChange={() => onCheck(rowData.id)} />
        );
      } else if (type) {
        return handleType(type, [_.get(rowData, dataKey[0])], rowConfig);
      } else {
        return _.get(rowData, dataKey[0]) ?? '-';
      }
    }
  };

  if (isSmallScreen)
    return (
      <Accordion collapseAll className="border-none">
        {data.map((el: any) => (
          <Accordion.Panel className="" key={el.id}>
            <Accordion.Title
              style={{ borderBottom: '1px solid #4F4F4F' }}
              className="mobile-table dark:border-b-1 relative h-[52px] dark:hover:bg-transparent dark:focus:ring-0 dark:focus:ring-offset-0">
              <div className="absolute top-[18px] flex w-full items-center justify-between pr-9">
                <div className="flex items-center gap-4 text-xs font-semibold leading-3 text-white">
                  {tableConfig.map(rowConfig =>
                    rowConfig.dataKey[0] === 'Checkbox' ? <Checkbox key={rowConfig.dataKey[0]} /> : null
                  )}
                  {tableConfig.map(rowConfig => (rowConfig?.mobileLeft ? handleRowView(rowConfig, el) : null))}
                </div>
                <div>
                  {tableConfig.map(rowConfig => (rowConfig?.mobileRight ? _.get(el, rowConfig.dataKey[0]) : null))}
                </div>
              </div>
            </Accordion.Title>

            <Accordion.Content>
              <div>
                {tableConfig.map((rowConfig, i) =>
                  rowConfig.dataKey[0] !== 'Checkbox' && !rowConfig?.mobileLeft && !rowConfig.mobileRight ? (
                    <div className="flex justify-between border-b border-neutral-600 p-4" key={i}>
                      <div className="flex flex-col text-sm text-zinc-400">
                        <div>{rowConfig.header}</div>
                      </div>

                      <div key={rowConfig.dataKey[0]} className='className="flex flex-col text-sm'>
                        {handleRowView(rowConfig, el)}
                      </div>
                    </div>
                  ) : null
                )}
              </div>
            </Accordion.Content>
          </Accordion.Panel>
        ))}
      </Accordion>
    );

  return (
    <div className="block w-full overflow-x-auto rounded-t-lg">
      <table className={`w-full`}>
        <thead className="h-[50px]">
          <tr>
            {tableConfig.map(el => (
              <th className={thClass} key={el.header} onClick={el?.sort ? el?.sort.sorting : null}>
                <div className="flex w-full cursor-pointer items-center justify-start gap-4">
                  {el.header === 'Checkbox' ? (
                    <Checkbox checked={checkedIds && data.length === checkedIds.length} onChange={onCheckAll} />
                  ) : (
                    <div>{el.header}</div>
                  )}
                  {el.sort ? handleSort(el.sort, sorted) : null}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((el: any) => (
            <tr key={el.id} className={bodyRowClass}>
              {tableConfig.map(rowConfig => (
                <td key={rowConfig.dataKey[0]} className={bodyCellClass + 'h-[80.83px]'}>
                  {handleRowView(rowConfig, el)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTable;
