import classNames from "classnames";
import { Button } from "flowbite-react";
import Image from 'next/image';
import { ActionButtonProps } from "./StoragePlan.types";

export const ActionButtons: React.FC<ActionButtonProps> = ({ actions }) => {
    return (
      <div className="order-last flex flex-row items-end gap-8">
        {actions.map((action: any, index: number) => (
          <Button
            className={classNames('border-0 p-1 lg:block', { 'flex-row-reverse': action.isIconPostfix })}
            size="lg"
            gradientDuoTone={action.isFlat ? 'transparent' : 'primary'}
            onClick={action.onClick}
            key={index + action.label}
            isProcessing={action.isProcessing}>
            <div className={classNames('flex gap-2', { 'flex-row-reverse': action.isIconPostfix })}>
              {!action.isProcessing && <Image priority src={action.icon} alt={action.label} />}
              <div>{action.label}</div>
            </div>
          </Button>
        ))}
      </div>
    );
  };
  