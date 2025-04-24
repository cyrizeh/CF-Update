import { ViewTypes } from '@/types';

export const GradientWrapper = ({ children, bgClass }: ViewTypes.GradientWrapperProps) => {
  return (
    <div className="w-24 select-none rounded-lg bg-gradient-to-r from-cryo-blue to-cryo-cyan p-px">
      <div className={`back cursor-pointer rounded-lg px-3 py-2 text-sm font-normal text-white ${bgClass}`}>
        <div className="flex items-center justify-center">{children}</div>
      </div>
    </div>
  );
};
