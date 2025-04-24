import {
  buildAdminCanesPageRoute,
  buildAdminDevicesPageRoute,
  buildAdminSpecimensPageRoute,
} from '@/constants/buildRoutes';
import InventoryTabs from '@/features/Specimens/InventoryTabs';
import useTranslation from 'next-translate/useTranslation';
import dynamic from 'next/dynamic';
import React from 'react';

const LayoutWithNoSSR = dynamic(() => import('@/components/Layout/Layout'), { ssr: false });

const InventoryPage = () => {
  return null;
};

export const NestedLayout = ({ children }: any) => {
  const childrenProps = {};
  const { t } = useTranslation('specimens');

  const inventoryTabs = [
    {
      key: 'canes',
      name: 'Canes',
      url: buildAdminCanesPageRoute(),
    },
    {
      key: 'devices',
      name: 'Devices',
      url: buildAdminDevicesPageRoute(),
    },
    {
      key: 'specimens',
      name: 'Specimens',
      url: buildAdminSpecimensPageRoute(),
    },
  ];
  return (
    <LayoutWithNoSSR>
      <div className="flex flex-col gap-8">
        <h1 className="mb-8 bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-5xl font-light text-transparent">
          {t('title')}
        </h1>

        <div className="flex flex-wrap items-center justify-between">
          <InventoryTabs inventoryTabs={inventoryTabs} />
        </div>

        {React.cloneElement(children, childrenProps)}
      </div>
    </LayoutWithNoSSR>
  );
};

export const InventoryPageLayout = (page: any) => <NestedLayout>{page}</NestedLayout>;

InventoryPage.getLayout = InventoryPageLayout;

export default InventoryPage;
