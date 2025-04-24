import { TableLink } from '@/components/DataGrid/TableComponents';
import classNames from 'classnames';
import { Spinner } from 'flowbite-react';
import { ReactElement } from 'react';

const mapValueToString = (value: string | number | boolean): string => {
  if (typeof value === 'number') {
    return value.toString();
  } else if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  } else {
    return value;
  }
};

const DetailsCard = ({
  details,
  title,
  icon,
  children,
  headerNode,
  isLoading,
}: {
  details: any[];
  title: string;
  icon?: ReactElement;
  children?: React.ReactNode;
  headerNode?: React.ReactNode;
  isLoading?: boolean;
}) => {
  const renderContent = (name: string, value: string, link?: string, styles?: any) => {
    if (isLoading) {
      return <Spinner key={name} size="sm" className="mt-[-1px]" />;
    }

    if (link) {
      return <TableLink href={link} name={value} styles={{ name: `w-auto break-all ${styles?.value}` }} />;
    }

    return <div className={classNames('w-auto break-all', styles?.value)}>{mapValueToString(value)}</div>;
  };

  // Todo: add types
  const renderDetailItem = ({ name, value, link, styles }: any) => {
    const formattedValue = mapValueToString(value);

    if (!formattedValue) {
      return null;
    }

    return (
      <div
        key={name}
        className="my-2 flex justify-between gap-12 rounded-md border border-transparent px-4 py-3 text-sm font-normal leading-tight text-gray-300 dark:bg-[#292B2C]">
        <div>{name}</div>
        {renderContent(name, value, link, styles)}
      </div>
    );
  };
  return (
    <div className="min-w-full max-w-[370px] items-center gap-3 rounded-md border border-transparent p-4 text-white sm:p-8 md:max-w-full dark:bg-[#1E2021] ">
      <div className="flex justify-between">
        <div className="flex items-center gap-1 text-center">
          <div className="flex h-[25px] w-[25px] justify-center">{icon}</div>

          <div className="flex items-center text-center">
            <span className="text-2xl font-normal text-white">{title}</span>
          </div>
        </div>
        <div className="flex flex-row items-center gap-2 text-center">{headerNode}</div>
      </div>
      {details.map(renderDetailItem)}
      {children}
    </div>
  );
};

export default DetailsCard;
