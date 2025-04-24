import { useSidebarContext } from '@/contexts';
import { isSmallScreen } from '@/utils';
import { MainProps } from './Main.types';

const Main = ({ children }: MainProps) => {
  const { isOpenOnSmallScreens, setOpenOnSmallScreens } = useSidebarContext();

  const handleMainClick = () => {
    if (isSmallScreen() && isOpenOnSmallScreens) {
      setOpenOnSmallScreens(false);
    }
  };

  return (
    <main className="overflow-y-auto relative w-full h-full lg:ml-0 bg-[#161C1E]" onClick={handleMainClick}>
      {children}
    </main>
  );
};

export default Main;
