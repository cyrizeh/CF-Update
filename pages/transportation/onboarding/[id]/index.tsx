import { useCallback, useEffect, useState } from 'react';
import OnboardingLayoutWithNoSSR from '@/components/OnboardingLayout/OnboardingLayoutWithNoSSR';
import { useRouter } from 'next/router';
import { useGetPartnerTransportations, useGetTransportationInfo } from '@/api/queries/patient.queries';
import useTranslation from 'next-translate/useTranslation';
import { useDocumentsMutation } from '@/api/mutations/useDocumentsMutation';
import { Button } from 'flowbite-react';
import classNames from 'classnames';
import Image from 'next/image';
import ContactUsPanel from '@/features/Onboarding/ContactUsPanel';
import arrowNextIcon from '@/public/icons/arrow-right.svg';
import pencilIcon from '@/public/icons/pencil.svg';
import { Alert } from '@/components/Alert/Alert';
import { HiCheckCircle } from 'react-icons/hi';
import { Payer } from '@/types/view/Payer.enum';
import arrowBackIcon from '@/public/icons/arrow-left-primary.svg';
import { mutate } from 'swr';

const OnboardingStep = () => {
  const router = useRouter();
  const { id, event } = router.query;
  const transportationId = router.query.id as string;
  const {
    data: partnerData,
    isLoading: isPartnerDataLoading,
    mutate: refetchPartnerTransportations,
  } = useGetPartnerTransportations();
  const { data: patient } = useGetTransportationInfo(id as string);
  const [partnerTransportations, setPartnerTransportations] = useState<any>(null);

  const { data: signingData, trigger: startDocumentSigning, isMutating } = useDocumentsMutation();
  const signingStatus = localStorage.getItem('signingStatus');
  const [actionButtons, setActionButtons] = useState<any[]>([
    {
      label: 'Loading...',
      icon: arrowNextIcon,
      isIconPostfix: true,
      isFlat: false,
      isProcessing: true,
    },
  ]);
  const { t } = useTranslation('onboarding');
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  useEffect(() => {
    mutate(null);
  }, []);

  useEffect(() => {
    if (partnerData) {
      setPartnerTransportations(partnerData);
    }
  }, [partnerData]);

  const docusignFailedStatuses = [
    'access_code_failed',
    'cancel',
    'decline',
    'exception',
    'fax_pending',
    'session_timeout',
    'ttl_expired',
  ];

  const handleSignDocumentClick = useCallback(() => {
    const mapped: any = {
      patientDocumentId: patient?.patientDocument.id,
      callbackUrl: window.location.href,
    };

    startDocumentSigning(mapped);
  }, [patient?.patientDocument.id, startDocumentSigning]);

  const handleNextClick = () => {
    if (partnerTransportations?.items.some((item: any) => item.transportationRequestId === transportationId)) {
      router.push(`/transportation/onboarding/congrats`);
      return;
    }
    if (patient?.payer === Payer.Patient) {
      router.push(`/transportation/onboarding/payment`);
      return;
    } else {
      router.push(`/transportation/onboarding/noPayment`);
      return;
    }
  };

  useEffect(() => {
    switch (event) {
      case 'signing_complete':
      case 'viewing_complete':
        refetchPartnerTransportations(undefined, { revalidate: true });
        setIsAlertOpen(true);
        localStorage.setItem('signingStatus', 'completed');
        break;
      default:
        if (docusignFailedStatuses.includes(event as string)) {
          setIsAlertOpen(true);
          localStorage.setItem('signingStatus', 'error');
        }
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);

  useEffect(() => {
    if (!patient) {
      return;
    }

    const isDocumentSigning = patient?.patientDocument.status === 'Signed' || signingStatus === 'completed';

    setActionButtons([
      {
        label: 'Back',
        onClick: () => {
          router.push(`/transportation/onboarding/confirm-details/${transportationId}`);
        },
        icon: arrowBackIcon,
        isIconPostfix: false,
        isFlat: true,
        isDisabled: false,
      },
      isDocumentSigning
        ? {
            label: t('next'),
            onClick: handleNextClick,
            icon: arrowNextIcon,
            isIconPostfix: true,
            isFlat: false,
            isDisabled: isPartnerDataLoading || !partnerTransportations,
            isProcessing: isPartnerDataLoading || !partnerTransportations,
          }
        : {
            label: t('sign_document'),
            onClick: handleSignDocumentClick,
            icon: pencilIcon,
            isIconPostfix: false,
            isFlat: false,
            isProcessing: isMutating,
          },
    ]);
  }, [isMutating, event, patient, isPartnerDataLoading, partnerTransportations]);

  useEffect(() => {
    if (signingData && !isMutating) {
      window.location.assign(signingData?.signingUrl);
    }
  }, [signingData, isMutating]);

  const handleClose = () => {
    setIsAlertOpen(false);
  };

  setTimeout(handleClose, 3000);

  return (
    <>
      {isAlertOpen && (
        <div className="absolute w-full md:top-12">
          <Alert
            variant={signingStatus === 'completed' ? 'success' : 'failure'}
            icon={HiCheckCircle}
            onDismiss={handleClose}
            message={signingStatus === 'completed' ? t('success_status_message') : t('error_status_message')}
          />
        </div>
      )}
      <div className="grid-rows-[repeat(3,_minmax(0,_auto)] md:grid-rows-[repeat(2,_minmax(0,_auto)] relative mt-3 grid gap-8 rounded-lg border-[1px] px-4 py-8 text-base font-normal shadow-md transition md:px-8 md:py-10 dark:border-teal-400 dark:bg-cryo-grey dark:text-neutral-50 ">
        <div className="flex">
          <div className="bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-[36px] font-light leading-[60px] text-transparent md:flex-row md:items-center">
            {t('transportation.step1.title')}
          </div>
        </div>
        <div className="text-4 font-light">{t('transportation.step1.description1')}</div>
        <div className="text-4 font-light">{t('transportation.step1.description2')}</div>
        <div className="text-4 font-light">{t('transportation.step1.description3')}</div>
        <div className="order-last mb-3 flex flex-row items-end justify-between gap-8">
          {actionButtons?.map((action: any, index: number) => {
            return (
              <Button
                className={classNames(' border-0 p-1 lg:block', { 'flex-row-reverse': action.isIconPostfix })}
                size="lg"
                gradientDuoTone={action.isFlat ? 'transparent' : 'primary'}
                onClick={action.onClick}
                key={index + action.label}
                disabled={action.isDisabled}
                isProcessing={action.isProcessing}>
                <div className={classNames('flex gap-2', { 'flex-row-reverse': action.isIconPostfix })}>
                  {!action.isProcessing && <Image priority src={action.icon} alt={action.label} />}
                  <div>{action.label}</div>
                </div>
              </Button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end">
        <ContactUsPanel />
      </div>
    </>
  );
};

OnboardingStep.getLayout = (page: any) => <OnboardingLayoutWithNoSSR>{page}</OnboardingLayoutWithNoSSR>;

export default OnboardingStep;
