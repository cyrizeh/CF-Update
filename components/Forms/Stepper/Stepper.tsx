import navItem from '@/public/icons/NavItem.svg';
import navItemActive from '@/public/icons/NavItemActive.svg';
import classNames from 'classnames';
import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';

type Props = {
  steps: Array<string>;
  currentStep: number;
};

const Stepper = ({ steps, currentStep }: Props) => {
  const { t } = useTranslation('clinics');

  const isLastStep = (index: number): boolean => Boolean(steps.length - 1 === index);

  const isActive = (index: number): boolean => Boolean(currentStep > index);

  return (
    <div className="mb-5 flex w-full items-center justify-between">
      {steps?.map((value, index: number) => (
        <div key={index} className={classNames('flex items-center', { 'w-full': !isLastStep(index) })}>
          <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-full lg:h-12 lg:w-12">
            <Image alt="navItem" src={isActive(index) ? navItemActive : navItem} />

            {!!value.length && (
              <div
                className={classNames('pt-[6px] text-xs font-medium', {
                  '!dark:text-white !text-white !opacity-100': isActive(index),
                  'opacity-50': !isActive(index),
                })}>
                {t(value)}
              </div>
            )}
          </div>

          {!isLastStep(index) && (
            <div className="flex w-full justify-center">
              <div className="divider h-[1px] w-[60%] border-b border-cryo-light-grey" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Stepper;
