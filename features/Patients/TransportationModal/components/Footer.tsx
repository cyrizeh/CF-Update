import Image from 'next/image';
import { Button, Spinner } from 'flowbite-react';

import { SubmitHandler } from 'react-hook-form';
import { PatientFormValues } from '@/types/view';

import arrowNextIcon from '@/public/icons/arrow-right.svg';
import useTranslation from 'next-translate/useTranslation';

type Props = {
  onClose: () => void;
  isLastStep: boolean;
  // eslint-disable-next-line no-unused-vars
  stepClick: (data: any) => Promise<void>;
  handleSubmit: any;
  isSubmitting?: boolean;
};

const Footer = ({ onClose, isLastStep, stepClick, handleSubmit, isSubmitting }: Props) => {
  const { t } = useTranslation();

  const onSubmit: SubmitHandler<PatientFormValues> = data => {
    stepClick(data);
  };

  return (
    <div className="flex w-full justify-between">
      <Button color="transparent" onClick={onClose}>
        {t('common:cancel')}
      </Button>

      {isLastStep ? (
        <Button gradientDuoTone="primary" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
          <div className="item-center flex gap-2">
            {isSubmitting ? <Spinner size="sm" /> : null}
            {t('common:initiateAgreement')}
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
