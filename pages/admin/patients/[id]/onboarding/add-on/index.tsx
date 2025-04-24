import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { Button, Spinner } from 'flowbite-react';
import classNames from 'classnames';
import Image from 'next/image';
import arrowNextIcon from '@/public/icons/arrow-right.svg';
import arrowBackIcon from '@/public/icons/arrow-left-primary.svg';
import { formatDateWithSlashSeparator } from '@/utils/formatDateWithSlashSeparator';
import { useGetExtraProtectionSubscriptionPlanByAdmin } from '@/api/queries/patient.queries';
import useToggleModal from '@/hooks/useToggleModal';
import ConfirmationModal from '@/components/ConfirmationModal/ConfirmationModal';
import usePatientPaymentMutation from '@/api/mutations/usePatientPaymentMutation';
import { toast } from 'react-toastify';
import { EPP_LINK } from '@/constants/billing';
import { useEffect, useState } from 'react';
import { PatientProfilePageLayout } from '../..';
import { useGetOnboardingDataByAdmin } from '@/api/queries/onboarding.queries';

const AddOn = () => {
  const router = useRouter();
  const { t } = useTranslation('onboarding');
  const patientId = router?.query?.id as string;
  const { isModalOpen, onCloseModal, onOpenModal } = useToggleModal();
  const { data: extraProtectiondata, isLoading } = useGetExtraProtectionSubscriptionPlanByAdmin({ patientId });
  const { eppChoiceByAdmin } = usePatientPaymentMutation();
  const [extraProtectionPrice, setExtraProtectionPrice] = useState<string>('');
  const [nextBillingDate, setNextBillingDate] = useState<string>('');
  const { data: onboardingData, isLoading: onboardingDataLoading } = useGetOnboardingDataByAdmin(patientId);

  useEffect(() => {
    if (extraProtectiondata) {
      setExtraProtectionPrice(((extraProtectiondata?.extraProtectionPrice || 0) / 100).toFixed(2));
      setNextBillingDate(
        extraProtectiondata?.nextBillingDate ? formatDateWithSlashSeparator(extraProtectiondata?.nextBillingDate) : ''
      );
    }
  }, [extraProtectiondata]);

  const handleEppChoice = async (option: string) => {
    await eppChoiceByAdmin.trigger({ eppChoice: option, patientId }).catch(() => {
      toast.error('Error during setting EPP');
    });
    router.push(`/admin/patients/${patientId}/onboarding/schedule-payment`);
  };

  const actionButtons = [
    {
      label: t('common:back'),
      onClick: () => {
        router.push(`/admin/patients/${patientId}/onboarding/storage-plan`);
      },
      icon: arrowBackIcon,
      isIconPostfix: false,
      isFlat: true,
      isDisabled: false,
    },
    {
      label: t('epp.optIn'),
      onClick: () => onOpenModal(),
      icon: arrowNextIcon,
      isIconPostfix: true,
      isFlat: false,
    },
  ];

  if (isLoading || onboardingDataLoading) {
    return (
      <div className="absolute z-20 flex h-full w-full items-center justify-center rounded-lg	bg-black/10 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-2 text-sm text-white">
          <Spinner size="sm" className="mt-[-1px]" /> Loading...
        </div>
      </div>
    );
  }

  if (onboardingData?.status === 'Onboarded') {
    router.push(`/admin/patients/${patientId}/onboarding/congrats`);
    return;
  }

  return (
    <>
      <div className="mb-4 flex flex-row items-baseline justify-between gap-2"></div>
      <div className="grid-rows-[repeat(3,_minmax(0,_auto)] md:grid-rows-[repeat(2,_minmax(0,_auto)] relative grid gap-8 rounded-lg border-[1px] px-4 text-base font-normal shadow-md transition md:px-8 md:py-10 dark:border-teal-400 dark:bg-cryo-grey dark:text-neutral-50 ">
        <div className="flex max-w-full">
          <div className="text-4xl font-light text-white md:flex-row md:items-center "> {t('epp.title')} </div>
        </div>

        <div>
          <div className="text-4 font-light">{t('epp.description')}</div>
          <div className="text-4 mt-3 font-light">
            <span className="align-super text-xs">*</span>
            {t('epp.additionalInfo')}
            <a target="_blank" rel="noopener noreferrer" href={EPP_LINK} className="cursor-pointer underline">
              {t('epp.terms')}
            </a>
            .
          </div>
        </div>

        <div className="flex flex-col">
          <div className=" mb-3 flex flex-row items-end justify-between gap-8">
            {actionButtons?.map((action: any, index: number) => {
              return (
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
              );
            })}
          </div>
          <div className="flex justify-end">
            <span
              className="p-2 text-base font-light text-white underline transition hover:cursor-pointer dark:text-gray-400 dark:hover:text-white"
              onClick={() => {
                handleEppChoice('OptOut');
              }}>
              {t('epp.optOut')}
            </span>
          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        title={'Subscribe'}
        onClose={onCloseModal}
        onConfirm={() => {
          handleEppChoice('Subscribe');
        }}
        confirmButtonText={'Subscribe'}>
        <div className=" flex flex-col gap-2 text-start text-lg font-light text-white">
          <p>
            {`Extra Protection Plan (Storage Service Guarantee) through `}
            {nextBillingDate}: ${extraProtectionPrice}.
          </p>

          <p>Each annual payment thereafter will be ${extraProtectionPrice} until you cancel or unsubscribe.</p>
          <p>
            <span>{t('epp.confirmationPart1')}</span>
            <a target="_blank" rel="noopener noreferrer" href={EPP_LINK} className="cursor-pointer underline">
              terms and conditions
            </a>
            <span>{t('epp.confirmationPart2')}</span>
          </p>
        </div>
      </ConfirmationModal>
    </>
  );
};

AddOn.getLayout = PatientProfilePageLayout;

export default AddOn;
