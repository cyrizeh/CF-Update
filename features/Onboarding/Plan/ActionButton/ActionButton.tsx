import { Button } from 'flowbite-react';
import Image from 'next/image';
import classNames from 'classnames';

interface ActionButtonProps {
  action: any;
  isSignupPatient: boolean;
  showPlanSelection: boolean;
  disableUserToGoToTheNextStep: boolean | null | undefined;
  index: number;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  action,
  isSignupPatient,
  showPlanSelection,
  disableUserToGoToTheNextStep,
  index,
}) => {
  const isDisabled = isSignupPatient && !showPlanSelection ? false : index === 1 && disableUserToGoToTheNextStep;

  return (
    <Button
      className={classNames('border-0 p-1 lg:block', { 'flex-row-reverse': action.isIconPostfix })}
      size="lg"
      disabled={isDisabled}
      gradientDuoTone={action.isFlat ? 'transparent' : 'primary'}
      onClick={action.onClick}
      isProcessing={action.isProcessing}>
      <div className={classNames('flex gap-2', { 'flex-row-reverse': action.isIconPostfix })}>
        {!action.isProcessing && <Image priority src={action.icon} alt={action.label} />}
        <div>{action.label}</div>
      </div>
    </Button>
  );
};

export default ActionButton;
