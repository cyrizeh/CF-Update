import { ViewTypes } from '@/types';
import type { AppProps } from 'next/app';

export type AppPropsWithLayout = AppProps & {
  Component: ViewTypes.NextPageWithLayout;
};
