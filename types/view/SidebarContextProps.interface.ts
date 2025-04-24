export interface SidebarContextProps {
  isOpenOnSmallScreens: boolean;
  isPageWithSidebar: boolean;
  setOpenOnSmallScreens: (isOpen: boolean) => void;
}