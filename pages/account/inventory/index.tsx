import { useGetAccountById } from '@/api/queries/account.queries';
import { useGetUsers } from '@/api/queries/user.queries';
import {
  buildAccountCanesPageRoute,
  buildAccountDevicesPageRoute,
  buildAccountSpecimensPageRoute,
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

  const { data: usersData } = useGetUsers();
  const { data: account } = useGetAccountById(usersData?.accountId as string);

  const inventoryTabs = [
    {
      key: 'canes',
      name: 'Canes',
      url: buildAccountCanesPageRoute(),
    },
    {
      key: 'devices',
      name: 'Devices',
      url: buildAccountDevicesPageRoute(),
    },
    {
      key: 'specimens',
      name: 'Specimens',
      url: buildAccountSpecimensPageRoute(),
    },
  ];
  return (
    <LayoutWithNoSSR>
      <div className="flex flex-col gap-8">
        <div className="mb-0 flex flex-col  gap-4 text-[40px] font-light leading-[60px] md:mb-4 md:flex-row md:items-center">
          <p className="bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text pb-2 text-5xl text-transparent md:h-14">
            {account?.name}
          </p>
        </div>

        <p className="mb-0 w-72 bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-4xl font-light text-transparent">
          {t('title')}
        </p>

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
