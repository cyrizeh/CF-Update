/* eslint-disable @next/next/no-html-link-for-pages */
import { Dropdown } from 'flowbite-react';
import { getInitials } from '@/utils/getInitials';
import { ViewTypes } from '@/types';

const UserDropdown = ({ email }: ViewTypes.UserDropdownProps) => {
  const clearStorage = () => {
    localStorage.clear();
  };

  return (
    <Dropdown
      arrowIcon={false}
      inline
      label={
        <span>
          <span className="sr-only">User menu</span>
          <div className="relative inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-full  bg-gradient-to-r from-blue-600 to-teal-400">
            <span className="sensitive font-medium text-gray-600 dark:text-gray-300">
              {getInitials(email as string)}
            </span>
          </div>
        </span>
      }>
      <Dropdown.Header>
        <span className="sensitive block truncate text-sm font-medium">{email}</span>
      </Dropdown.Header>
      <Dropdown.Item className="p-0">
        <a onClick={clearStorage} href="/api/auth/logout" className="block w-full text-left">
          <p className="mx-4 my-2">Log out</p>
        </a>
      </Dropdown.Item>
    </Dropdown>
  );
};

export default UserDropdown;
