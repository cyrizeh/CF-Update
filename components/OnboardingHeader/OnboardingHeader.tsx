import logo from '@/public/images/logo.svg';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Navbar } from 'flowbite-react';
import Image from 'next/image';
import UserDropdown from '../UserDropdown/UserDropdown';

const OnboardingHeader = () => {
  const { user } = useUser();

  return (
    <Navbar fluid>
      <div className="top-0 z-20 w-full lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Navbar.Brand href="/">
              <Image alt="logo" width={32} height={32} src={logo} className="mr-3 h-6 sm:h-8" />
            </Navbar.Brand>
          </div>
          <div>
            <div className="flex items-center gap-3">
              {user && <UserDropdown email={user.email} />}
            </div>
          </div>
        </div>
      </div>
    </Navbar>
  );
};

export default OnboardingHeader;
