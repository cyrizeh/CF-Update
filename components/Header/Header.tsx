import { useUser } from '@auth0/nextjs-auth0/client';
import { Navbar } from 'flowbite-react';
import Image from 'next/image';
import { HiMenuAlt2, HiX } from 'react-icons/hi';

import UserDropdown from '../UserDropdown/UserDropdown';

import { isSmallScreen, isUserAdmin, isUserGodAdmin } from '@/utils';

import { useSidebarContext } from '@/contexts';

import useRole from '@/hooks/useRole';
import logo from '@/public/images/logo.svg';
import NotificationBell from '../NotificationBell/NotificationBell';

const Header = () => {
  const { isOpenOnSmallScreens, isPageWithSidebar, setOpenOnSmallScreens } = useSidebarContext();
  const { user } = useUser();
  const { roles } = useRole();
  return (
    <Navbar fluid>
      <div className="top-0 z-20 w-full lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Navbar.Brand href="/">
              <Image alt="logo" width={32} height={32} src={logo} className="mr-3 h-6 sm:h-8" />
            </Navbar.Brand>

            {isPageWithSidebar && (
              <button
                onClick={() => setOpenOnSmallScreens(!isOpenOnSmallScreens)}
                className="mr-3 cursor-pointer rounded p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 lg:inline dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                <span className="sr-only">Toggle sidebar</span>
                {isOpenOnSmallScreens && isSmallScreen() ? (
                  <HiX className="h-6 w-6" />
                ) : (
                  <HiMenuAlt2 className="h-6 w-6" />
                )}
              </button>
            )}
          </div>
          <div>
            <div className="flex items-center gap-3">
              {(isUserAdmin(roles) || isUserGodAdmin(roles)) && <NotificationBell />}
              {user && <UserDropdown email={user.email} />}
            </div>
          </div>
        </div>
      </div>
    </Navbar>
  );
};

export default Header;
