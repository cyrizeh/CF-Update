import { Button, Dropdown as DropdownFlowbite } from 'flowbite-react';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
export const Dropdown = ({ list }: any) => {
  return (
    <DropdownFlowbite
      label=""
      className="flex flex-col gap-6"
      disabled={true}
      renderTrigger={() => (
        <div>
          <HiOutlineDotsHorizontal size={16} />
        </div>
      )}>
      {list.map((item: any) => (
        <div key={item.label} className="my-2 flex cursor-pointer items-center justify-center rounded-lg ">
          <Button
            disabled={item.disabled}
            onClick={item.onclick}
            className={`mx-2 flex w-full cursor-pointer items-center justify-center rounded-lg `}>
            {item.label}
          </Button>
        </div>
      ))}
    </DropdownFlowbite>
  );
};
