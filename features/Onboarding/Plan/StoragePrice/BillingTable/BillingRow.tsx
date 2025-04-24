import { StorageDurationNames } from '@/constants/billing';
import { Label, Radio } from 'flowbite-react';
import { formatPrice } from '../../utils/billingUtils';

const BillingRow = ({
  billing,
  criteria,
  onSelect,
  isSelected,
}: {
  billing: any;
  criteria: string;
  onSelect: () => void;
  isSelected: boolean;
}) => {
  const getPrices = () => {
    switch (criteria) {
      case 'SpecimenTypes':
        return (
          <>
            <div className="text-sm text-gray-300">{formatPrice(billing?.embryoPrice)}</div>
            <div className="text-sm text-gray-300">{formatPrice(billing?.oocytePrice)}</div>
            <div className="text-sm text-gray-300">{formatPrice(billing?.spermPrice)}</div>
          </>
        );
      case 'Patient':
        return <div className="text-center text-sm text-gray-300">{formatPrice(billing?.patientPrice)}</div>;
      case 'NumberOfCanes':
        return <div className="text-sm text-gray-300">{formatPrice(billing?.canePrice)}</div>;
      default:
        return null;
    }
  };

  return (
    <div className="grid items-center gap-4 border-b border-neutral-700 p-4 grid-cols-[minmax(100px,_1fr)_repeat(3,_1fr)] md:grid-cols-[minmax(200px,_1fr)_repeat(3,_1fr)]">
      <div className="flex items-center gap-4">
        <Radio
          id={billing?.id}
          checked={isSelected}
          onClick={onSelect}
          className="cursor-pointer"
          value={billing?.id}
        />
        <Label
          htmlFor={billing?.id}
          className="flex h-[50px] w-full cursor-pointer items-center text-sm font-normal leading-[14px] text-white">
          {StorageDurationNames?.[billing?.storageDuration]}
        </Label>
      </div>
      {getPrices()}
    </div>
  );
};

export default BillingRow;
