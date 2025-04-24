import { Button } from 'flowbite-react';
import PencilAlt from '@/public/icons/PencilAlt';
import { ViewTypes } from '@/types';

const Panel = ({ title, isEditable, children, onEdit }: ViewTypes.Panel) => {
  return (
    <div className="rounded-md bg-[#1E2021] p-8">
      <div className={'flex flex-col gap-4'}>
        <div className="mb-3 flex justify-between text-2xl font-normal text-white">
          <div>{title}</div>
          {isEditable && (
            <Button className="border-0 p-1 lg:block" size={'sm'} gradientDuoTone="primary" onClick={onEdit}>
              <div className="mr-2">
                <PencilAlt />
              </div>
              <div>Edit</div>
            </Button>
          )}
        </div>
        {children}
      </div>
    </div>
  );
};

export default Panel;
