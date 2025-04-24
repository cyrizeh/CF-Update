'use client';

import { customTheme } from '@/theme/customTheme';
import { Flowbite } from 'flowbite-react';
import { FC, PropsWithChildren } from 'react';

const FlowbiteContext: FC<PropsWithChildren> = function ({ children }) {
  return <Flowbite theme={{ theme: customTheme, dark: true }}>{children}</Flowbite>;
};

export default FlowbiteContext;
