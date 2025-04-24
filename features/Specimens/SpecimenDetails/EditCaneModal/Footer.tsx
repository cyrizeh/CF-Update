import Image from 'next/image';
import { Button } from 'flowbite-react';

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
  isLoading: boolean;
};

const Footer = ({ onClose, isLastStep, stepClick, handleSubmit, isLoading }: Props) => {
  const { t } = useTranslation();

  const onSubmit: SubmitHandler<PatientFormValues> = data => {
    stepClick(data);
  };

  return (
    <div className="flex w-full justify-between">
      <Button color="transparent" onClick={onClose} className="dark:text-white">
        {t('common:cancel')}
      </Button>

      <Button gradientDuoTone="primary" onClick={handleSubmit(onSubmit)} disabled={isLoading}>
        {isLastStep ? (
          t('common:finish')
        ) : (
          <div className="flex gap-2">
            {t('common:next')} <Image priority src={arrowNextIcon} alt="next" />
          </div>
        )}
      </Button>
    </div>
  );
};

export default Footer;
