import { Radio } from 'flowbite-react';

type Billing = {
  id: string;
  name: string;
  description: string;
  price: number;
};

type ServiceGuaranteeRowProps = {
  billing: Billing;
  onSelect: () => void;
  isSelected: boolean;
};

const ServiceGuaranteeRow = ({ billing, onSelect, isSelected }: ServiceGuaranteeRowProps) => {
  return (
    <div className="flex items-center gap-4 border-b border-neutral-700 p-4">
      <div className="flex items-center gap-4">
        <Radio
          id={billing.id || billing.name}
          checked={isSelected}
          onClick={onSelect}
          className="cursor-pointer"
          value={billing.id}
        />
      </div>
      <label htmlFor={billing.id || billing.name} className="cursor-pointer text-sm text-gray-300">
        {billing.name}
        {billing.description ? ` - ${billing.description}` : ''}
      </label>
    </div>
  );
};

export default ServiceGuaranteeRow;
