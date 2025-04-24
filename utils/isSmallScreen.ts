import { isBrowser } from './isBrowser';

export const isSmallScreen = (): boolean => {
  return isBrowser() && window.innerWidth < 768;
};
