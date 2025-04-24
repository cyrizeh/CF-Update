import { useEffect, useMemo, useState } from 'react';

export const useScreenWidth = () => {
  const [width, setWidth] = useState<number>(0);
  const isSmallScreen = useMemo<boolean>(() => width < 768, [width]);

  useEffect(() => {
    const trackResize = () => {
      const currWidth = window.innerWidth;
      if (currWidth === width) return;
      setWidth(currWidth);
    };

    if (!window) return;
    trackResize();
    window.addEventListener('resize', trackResize);

    return () => {
      window.removeEventListener('resize', trackResize);
    };
  }, []);

  return { width, isSmallScreen };
};
