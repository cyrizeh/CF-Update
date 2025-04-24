import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

type NotificationsTab = {
  key: string;
  name: string;
  url: string;
};

type NotificationsTabsProps = {
  notificationsTabs: NotificationsTab[];
};

const NotificationsTabs = ({ notificationsTabs }: NotificationsTabsProps) => {
  const { pathname } = useRouter();
  const [currentPage, setCurrentPage] = useState(pathname);

  function getLastPathSegment(url: string): string {
    const segments = url.split('/');
    return segments[segments.length - 1];
  }

  useEffect(() => setCurrentPage(getLastPathSegment(pathname)), [pathname]);

  return (
    <div className="flex h-6 flex-row gap-8 text-sm font-medium leading-[150%] text-[#F9FAFB]">
      {notificationsTabs.map(tab => (
        <Link href={tab.url} key={tab.key}>
          <div
            className={
              currentPage === tab.key
                ? 'cursor-pointer border-b-[1px] border-blue-600 bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text font-medium text-transparent'
                : ''
            }>
            {tab.name}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default NotificationsTabs;
