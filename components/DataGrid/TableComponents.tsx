import dayjs from 'dayjs';
import Link from 'next/link';
import classNames from 'classnames';

export const TableLink = ({ href, name, styles }: { href: string; name: string; styles?: { name: string } }) => {
  return (
    <div>
      <Link href={href}>
        <div className="flex items-center gap-2 ">
          <span className={classNames(styles?.name, 'hover:underline')}>{name}</span>
        </div>
      </Link>
    </div>
  );
};

export const TableData = ({ date, customFormat = undefined }: { date: string; customFormat?: string | undefined }) => {
  return date ? <div>{dayjs(date).format(customFormat || 'MM/DD/YYYY')}</div> : <div> - </div>;
};
