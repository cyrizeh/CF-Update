import { useSidebarContext } from '@/contexts';
import { ViewTypes } from '@/types';
import { isSmallScreen } from '@/utils';
import classNames from 'classnames';
import { Sidebar as FlowbiteSidebar } from 'flowbite-react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

const iconProps = {
  color: '#F9FAFB',
  size: '1.5em',
};

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children }) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.preventDefault();
    router.push(href);
  };

  return (
    <span onClick={handleClick} className="cursor-pointer">
      {children}
    </span>
  );
};

const Sidebar: React.FC<ViewTypes.SidebarProps> = ({ items, toolItems = [] }) => {
  const { pathname } = useRouter();
  const { isOpenOnSmallScreens: isSidebarOpenOnSmallScreens } = useSidebarContext();
  const [currentPage, setCurrentPage] = useState(pathname);

  useEffect(() => setCurrentPage(pathname), [pathname]);

  return (
    <div
      className={classNames('lg:!block', 'h-full', 'fixed', 'md:static', 'left-0', 'top-[61px]', 'z-40', {
        hidden: !isSidebarOpenOnSmallScreens,
      })}>
      <FlowbiteSidebar
        className="sidebar dark:bg-cryo-dark-grey"
        collapsed={isSidebarOpenOnSmallScreens && !isSmallScreen()}>
        <div className="flex h-full flex-col justify-between overflow-auto py-2 pb-10 sm:pb-0">
          <FlowbiteSidebar.Items>
            <FlowbiteSidebar.ItemGroup>
              {items.map(item => (
                <NavLink key={item.key} href={item.path}>
                  <FlowbiteSidebar.Item as="span" icon={item.icon?.bind(this, iconProps)} className="mb-4">
                    <span className={classNames({ 'text-blue-500': currentPage === item.path })}>
                      {item.label}
                    </span>
                  </FlowbiteSidebar.Item>
                </NavLink>
              ))}
              {toolItems?.length > 0 && <div className="pb-2 dark:text-white">Tools</div>}
              {toolItems?.map(item => (
                <NavLink key={item.key} href={item.path}>
                  <FlowbiteSidebar.Item as="span" icon={item.icon?.bind(this, iconProps)} className="mb-4">
                    <span className={classNames({ 'text-blue-500': currentPage === item.path })}>
                      {item.label}
                    </span>
                  </FlowbiteSidebar.Item>
                </NavLink>
              ))}
            </FlowbiteSidebar.ItemGroup>
          </FlowbiteSidebar.Items>
        </div>
      </FlowbiteSidebar>
    </div>
  );
};

export default Sidebar;
