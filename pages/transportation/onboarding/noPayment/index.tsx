import OnboardingLayoutWithNoSSR from '@/components/OnboardingLayout/OnboardingLayoutWithNoSSR';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { Button, Spinner } from 'flowbite-react';
import classNames from 'classnames';
import Image from 'next/image';

import arrowNextIcon from '@/public/icons/arrow-right.svg';
import arrowBackIcon from '@/public/icons/arrow-left-primary.svg';
import ContactUsPanel from '@/features/Onboarding/ContactUsPanel';
import { Payer } from '@/types/view/Payer.enum';
import { useGetTransportations } from '@/api/queries/patient.queries';

const OnboardingStep = () => {
  const router = useRouter();
  const { t } = useTranslation('onboarding');
  const { data: transportationsData, isLoading: transportationDataLoading } = useGetTransportations();

  if (transportationDataLoading) {
    return (
      <div className="absolute z-20 flex h-full w-full items-center justify-center rounded-lg	bg-black/10 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-2 text-sm text-white">
          <Spinner size="sm" className="mt-[-1px]" /> Loading...
        </div>
      </div>
    );
  }

  const signingStatus = localStorage.getItem('signingStatus');
  const actionButtons = [
    {
      label: t('common:back'),
      onClick: () => {
        router.push(`/transportation/onboarding/${transportationsData?.items[0]?.transportationRequestId}`);
      },
      icon: arrowBackIcon,
      isIconPostfix: false,
      isFlat: true,
      isDisabled: false,
    },
    {
      label: t('transportation.step4.finish'),
      onClick: () => router.push(`/transportation/onboarding/congrats`),
      icon: arrowNextIcon,
      isIconPostfix: true,
      isFlat: false,
    },
  ];

  if (transportationsData) {
    const id = transportationsData?.items[0]?.transportationRequestId;
    if (signingStatus !== 'completed' && transportationsData?.items[0]?.documentStatus !== 'Completed' && id) {
      router.push(`/transportation/onboarding/${id}`);
    } else if (transportationsData?.items[0]?.payer === Payer.Patient) {
      router.push(`/transportation/onboarding/payment`);
    }
  }

  return transportationsData?.items?.length > 0 ? (
    <>
      <div className="grid-rows-[repeat(3,_minmax(0,_auto)] md:grid-rows-[repeat(2,_minmax(0,_auto)] relative grid gap-8 rounded-lg border-[1px] px-4 py-8 text-base font-normal shadow-md transition md:px-8 md:py-10 dark:border-teal-400 dark:bg-cryo-grey dark:text-neutral-50 ">
        <div className="max-w-[450px]">
          <div className="flex">
            <div className="mb-3  bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-[36px] font-light leading-[60px] text-transparent md:flex-row md:items-center ">
              {t('transportation.step4.title')}
            </div>
          </div>
        </div>
        <div className="text-4 mb-10 font-light">{t('transportation.step4.text')}</div>

        <div className="order-last mb-3 flex flex-row items-end justify-between gap-8">
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
      </div>
      <div className="flex justify-end">
        <ContactUsPanel />
      </div>
    </>
  ) : null;
};

OnboardingStep.getLayout = (page: any) => <OnboardingLayoutWithNoSSR>{page}</OnboardingLayoutWithNoSSR>;

export default OnboardingStep;
