import Image from 'next/image';
import { Button, Spinner } from 'flowbite-react';

import { SubmitHandler } from 'react-hook-form';
import { PatientFormValues } from '@/types/view';
import arrowIcon from '@/public/icons/arrow-left.svg';
import arrowNextIcon from '@/public/icons/arrow-right.svg';
import useTranslation from 'next-translate/useTranslation';
import classNames from 'classnames';

type Props = {
  onPrevStep: () => void;
  isLastStep: boolean;
  step: number;
  // eslint-disable-next-line no-unused-vars
  stepClick: (data: any) => Promise<void>;
  handleSubmit: any;
  isSubmitting?: boolean;
};

const Footer = ({ onPrevStep, isLastStep, step, stepClick, handleSubmit, isSubmitting }: Props) => {
  const { t } = useTranslation();

  const onSubmit: SubmitHandler<PatientFormValues> = data => {
    stepClick(data);
  };

  return (
    <div className="flex w-full  justify-between">
      <Button
        gradientDuoTone="primary"
        outline
        onClick={onPrevStep}
        className={classNames({ hidden: step === 1 })}
        disabled={step === 1}>
        <Image priority src={arrowIcon} alt="Prev" className="mr-2" />
        {t('common:back')}
      </Button>
      <div></div>
      {isLastStep ? (
        <Button gradientDuoTone="primary" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
          <div className="item-center flex gap-2">
            {isSubmitting ? <Spinner size="sm" /> : null}
            {t('common:createAccount')}
          </div>
        </Button>
      ) : (
        <Button gradientDuoTone="primary" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
          <div className="flex gap-2">
            {t('common:next')} <Image priority src={arrowNextIcon} alt="next" />
          </div>
        </Button>
      )}
    </div>
  );
};

export default Footer;
