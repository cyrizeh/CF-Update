import { ExtraProtectionProgram } from '@/types/api/Responses/PaymentInfoResponse.interface';
import { Radio } from 'flowbite-react';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';

interface ExtraProtectionProgramRowProps {
  program: ExtraProtectionProgram;
  onSelect: () => void;
  isSelected: boolean;
}
const ExtraProtectionProgramRow: React.FC<ExtraProtectionProgramRowProps> = ({ program, onSelect, isSelected }) => {
  const tempId = uuidv4();
  const radioId = program.id || tempId;

  return (
    <div className="flex items-center gap-4 border-b border-neutral-700 p-4">
      {/* Radio Button */}
      <div className="flex items-center gap-4">
        <Radio
          id={radioId}
          checked={isSelected}
          onClick={onSelect}
          className="cursor-pointer"
          value={program.id || ''}
        />
      </div>

      {/* Label for Radio */}
      <label htmlFor={radioId} className="cursor-pointer text-sm text-gray-300">
        {program.name}
        {program.description ? ` - ${program.description}` : ''}
      </label>
    </div>
  );
};

export default ExtraProtectionProgramRow;
