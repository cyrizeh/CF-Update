import { useEffect, useState, PropsWithChildren } from 'react';
import { useRouter } from 'next/router';
import { isSmallScreen } from '@/utils';
import { useLocalStorage } from '@/hooks';
import { SidebarContext } from './SidebarContext';

export const SidebarContextProvider = ({ children }: PropsWithChildren) => {
  const [isSidebarOpen, setIsSidebarOpen] = useLocalStorage<boolean>('isSidebarOpen', false);
  const [isOpen, setOpen] = useState(isSidebarOpen);
  const router = useRouter();
  const location = router.pathname;

  useEffect(() => {
    setIsSidebarOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (isSmallScreen()) {
      setOpen(false);
    }
  }, [location]);

  return (
    <SidebarContext.Provider
      value={{
        isOpenOnSmallScreens: isOpen,
        isPageWithSidebar: true,
        setOpenOnSmallScreens: setOpen,
      }}>
      {children}
    </SidebarContext.Provider>
  );
};
