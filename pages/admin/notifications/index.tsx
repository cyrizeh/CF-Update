import { TransportationContextProvider } from '@/contexts/TransportationContext';
import NotificationsTabs from '@/features/Notifications/NotificationsTabs';
import useTranslation from 'next-translate/useTranslation';
import dynamic from 'next/dynamic';
import React from 'react';

const LayoutWithNoSSR = dynamic(() => import('@/components/Layout/Layout'), { ssr: false });

const NotificationsPage = () => {
  return null;
};

export const NestedLayout = ({ children }: any) => {
  const childrenProps = {};
  const { t } = useTranslation('notifications');

  const notificationTabs = [
    {
      key: 'unread',
      name: 'Unread',
      url: `/admin/notifications/unread`,
    },
    {
      key: 'read',
      name: 'Read',
      url: `/admin/notifications/read`,
    },
  ];
  return (
    <LayoutWithNoSSR>
      <div className="flex flex-col gap-4">
        <h1 className="mb-4 w-[300px] bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-5xl font-light text-transparent">

          {t('title')}
        </h1>

        <div className="flex flex-wrap items-center justify-between">
          <NotificationsTabs notificationsTabs={notificationTabs} />
        </div>

        {React.cloneElement(children, childrenProps)}
      </div>
    </LayoutWithNoSSR>
  );
};

export const NotificationsPageLayout = (page: any) => (
  <TransportationContextProvider>
    <NestedLayout>{page}</NestedLayout>
  </TransportationContextProvider>
);

NotificationsPage.getLayout = NotificationsPageLayout;

export default NotificationsPage;
