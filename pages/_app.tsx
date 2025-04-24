import { ComponentType } from 'react';
import dynamic from 'next/dynamic';

import { AppPropsWithLayout } from './_app.types';

import FlowbiteContext from '@/contexts/FlowbiteContext/FlowbiteContext';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { SidebarContextProvider } from '@/contexts';

import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.min.css';
import '@/styles/globals.css';
import IdleTimer from '@/components/IdleTimer/IdleTimer';
import { SignalR } from '@/features/SignalR/SignalR';
import { NotificationsProvider } from '@/contexts/NotificationContext/NotificationContext';
import Script from 'next/script';
import { CryoGattProvider } from '@/contexts/CryoGattContext/CryoGattContext';
import { PermissionsProvider } from '@/contexts/PermissionsContext/PermissionsContext';
import PostHogProviderWrapper from '@/contexts/PostHog/PostHogWrapper';

const LayoutWithNoSSR = dynamic(() => import('../components/Layout/Layout'), {
  ssr: false,
});

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout =
    Component.getLayout ||
    (() => (
      <LayoutWithNoSSR>
        <Component {...pageProps} />
      </LayoutWithNoSSR>
    ));

  return (
    <FlowbiteContext>
      <UserProvider>
        <PermissionsProvider>
          <SidebarContextProvider>
            <CryoGattProvider>
              <NotificationsProvider>
                <SignalR>
                  <PostHogProviderWrapper>{getLayout(<Component {...pageProps} />)}</PostHogProviderWrapper>
                </SignalR>
              </NotificationsProvider>
            </CryoGattProvider>
          </SidebarContextProvider>
          <IdleTimer />
        </PermissionsProvider>
      </UserProvider>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <Script src="/BrowserPrint-3.1.250.min.js" strategy="beforeInteractive" />
    </FlowbiteContext>
  );
};

export default App as ComponentType<AppPropsWithLayout>;
