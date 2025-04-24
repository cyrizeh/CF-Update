import { BadgeProps } from '@/components/Badge/Badge.types';
import classNames from 'classnames';
import { useMemo } from 'react';

export const Badge = ({ children, textColor, endIcon = null }: BadgeProps) => {
  return useMemo(() => {
    return (
      <div className="inline-flex h-[22px] items-center justify-center gap-1 rounded-md bg-neutral-800 px-2.5 py-0.5">
        <div
          className={classNames(
            `text-center text-xs font-medium leading-[18px] text-${textColor} dark:text-${textColor} `
          )}>
          {children}
        </div>
        {!!endIcon && <span className="cursor-pointer">{endIcon}</span>}
      </div>
    );
  }, [children, endIcon, textColor]);
};
