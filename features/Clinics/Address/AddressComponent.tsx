import PencilAlt from '@/public/icons/PencilAlt';
import { ViewTypes } from '@/types';
import { Button } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import { FC } from 'react';

interface AddressProps {
  title: string;
  address: ViewTypes.Address;
  onEdit: () => void;
  isEditable?: boolean;
  dataTestId?: string;
}

const AddressComponent: FC<AddressProps> = ({ title, address, onEdit, isEditable, dataTestId }) => {
  const { t } = useTranslation('clinics');

  const { city, state, street1, street2, zipCode } = address;

  return (
    <div className="flex w-full justify-between rounded-lg bg-[#292B2C] px-4 py-3" data-testid={dataTestId}>
      <div className="flex flex-col gap-2.5 text-sm font-normal leading-[125%] text-[#D1D5DB]">
        <div
          className="overflow-wrap-all flex h-[40px] items-center text-sm font-normal leading-[125%] text-[#828282]"
          data-testid={dataTestId && `${dataTestId}-title`}>
          {title}
        </div>

        <div data-testid={dataTestId && `${dataTestId}-details`}>
          <div className="overflow-wrap-all" data-testid={dataTestId && `${dataTestId}-street1`}>
            {street1}
          </div>
          <div className="overflow-wrap-all" data-testid={dataTestId && `${dataTestId}-street2`}>
            {street2}
          </div>
          <div className="overflow-wrap-all" data-testid={dataTestId && `${dataTestId}-zipcode`}>
            {city}, {state} {zipCode}
          </div>
        </div>
      </div>

      {isEditable && (
        <Button
          gradientDuoTone="primary"
          size="sm"
          onClick={onEdit}
          data-testid={dataTestId && `${dataTestId}-edit-button`}>
          <div className="mr-2">
            <PencilAlt />
          </div>
          {t('common:edit')}
        </Button>
      )}
    </div>
  );
};

export default AddressComponent;
