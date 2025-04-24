import { SidebarContextProvider } from '@/contexts';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import Main from '../Main/Main';
import { useSidebarItems } from '@/hooks';
import { IconGradientsList } from '@/components/Icon/IconGradientsList';
import { PropsWithChildren, useEffect, useState } from 'react';
import Head from 'next/head';
import { useUser } from '@auth0/nextjs-auth0/client';
import posthog from 'posthog-js';

const Layout = ({ children }: PropsWithChildren) => {
  const { items, toolItems } = useSidebarItems();
  const [identified, setIdentified] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      if (user && !identified) {
        posthog.identify(`user_${user['.user-id']}`, {
          user_id: user['.user-id'],
        });
        setIdentified(true);
      }
    }
  }, [user]);

  return (
    <SidebarContextProvider>
      <Head>
        <title>CryoFuture</title>
      </Head>
      <Header />
      <div className="top-0 z-20 flex h-[calc(100vh_-_64px)] items-start">
        <Sidebar items={items} toolItems={toolItems} />
        <Main>
          <div className="h-full self-center px-4 pt-7 text-2xl font-semibold md:px-[55px] md:pt-[60px]">
            {children}
          </div>
        </Main>
      </div>
      <IconGradientsList />
    </SidebarContextProvider>
  );
};

export default Layout;
