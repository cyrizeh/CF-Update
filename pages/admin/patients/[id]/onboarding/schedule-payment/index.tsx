import classNames from 'classnames';
import { Button, Spinner } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { useGetOnboardingDataByAdmin } from '@/api/queries/onboarding.queries';
import { useGetNextPaymentByAdmin } from '@/api/queries/patient.queries';
import usePatientPaymentMutation from '@/api/mutations/usePatientPaymentMutation';
import PatientBillingFormSquare from '@/features/Patients/PatientBilling/PatientBiilingFormSquare/PatientBiilingFormSquare';
import arrowBackIcon from '@/public/icons/arrow-left-primary.svg';
import { PaymentSquareRequest } from '@/types/view/PatientPaymentDateSource.type';
import { toast } from 'react-toastify';
import { formatDateWithSlashSeparator } from '@/utils/formatDateWithSlashSeparator';
import { renderDescription } from '@/utils/renderDescription';
import { PatientProfilePageLayout } from '../..';

function StoragePlan() {
  const { t } = useTranslation('onboarding');
  const router = useRouter();
  const patientId = router?.query?.id as string;
  const [isExtraProtection, setIsExtraProtection] = useState<any>(null);
  const [isPaymentCompleted, setIsPaymentCompleted] = useState<boolean>(false);

  const { data: onboardingData, isLoading: onboardingDataLoading } = useGetOnboardingDataByAdmin(patientId);
  const { data, isLoading } = useGetNextPaymentByAdmin(patientId);
  const { handleSchedulePaymentByAdmin } = usePatientPaymentMutation();

  useEffect(() => {
    if (onboardingData) {
      setIsExtraProtection(onboardingData.steps.find(step => step.type === 'EppAddonStep'));
      setIsPaymentCompleted(
        onboardingData.steps.find(step => step.type === 'PaymentMethodAssignmentStep')?.status === 'Completed'
      );
    }
  }, [onboardingData]);

  const payBtnLabel = `Schedule Payment - $${data?.paymentAmount?.totalAmount} ${
    data?.billingDate ? `on ${formatDateWithSlashSeparator(data?.billingDate)}` : ''
  }`;
  const actions = [
    {
      label: t('back'),
      onClick: () => {
        if (isExtraProtection) {
          router.push(`/admin/patients/${patientId}/onboarding/add-on`);
        } else {
          router.push(`/admin/patients/${patientId}/onboarding/storage-plan`);
        }
      },
      icon: arrowBackIcon,
      isIconPostfix: false,
      isFlat: true,
      isDisabled: false,
    },
  ];

  const handleDonePayment = useCallback(() => {
    router.push(`/admin/patients/${patientId}/onboarding/congrats`);
  }, [router]);

  const handleSubmit = async ({ paymentMethodToken, verificationToken }: PaymentSquareRequest) => {
    const response = await handleSchedulePaymentByAdmin
      .trigger({ paymentMethodToken, verificationToken, patientId })
      .then(() => {
        toast.success('Payment was scheduled successfully');
        handleDonePayment();
      })
      .catch(() => {
        toast.error(`${t('failed_billing')}`);
      });

    return response;
  };

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
      <div className="grid-rows-[repeat(3,_minmax(0,_auto)] md:grid-rows-[repeat(2,_minmax(0,_auto)] relative grid grid-cols-1 gap-8 rounded-lg border-[1px] px-4 py-8 text-base font-normal shadow-md transition md:grid-cols-2 md:px-8 md:py-10 dark:border-teal-400 dark:bg-cryo-grey dark:text-neutral-50 ">
        <div>
          <div className="mb-6 text-4xl font-light text-white md:flex-row md:items-center ">
            Enter your Credit/Debit Card information
          </div>

          <div className="text-4 mb-3 font-light">
            {renderDescription(
              onboardingData?.steps.find(step => step.type === 'PaymentMethodAssignmentStep')?.description || ''
            )}
          </div>
        </div>

        <div className="relative min-h-[330px] md:row-span-2">
          <div className="relative w-full">
            <div className="mb-6 flex justify-start text-4xl font-light text-white md:flex-row md:items-center ">
              <p>Schedule payment</p>
            </div>

            <PatientBillingFormSquare
              btnLabel={payBtnLabel}
              total={data?.paymentAmount?.totalAmount}
              handleDone={handleDonePayment}
              handlePayment={handleSubmit}
              isSignupPatient={false}
              isPaymentCompleted={isPaymentCompleted}
            />
          </div>

          {data?.paymentAmount && (
            <div className="mt-8">
              {data?.paymentAmount?.invoiceLines.map((el: any, index: number) => (
                <div key={el.name + index + el.grossAmount} className="flex w-full flex-col">
                  <div className="inline-flex items-center justify-start gap-[160px] self-stretch">
                    <div className="flex h-[18px] shrink grow basis-0 items-center justify-start gap-[9px]">
                      <div className="shrink grow basis-0 text-sm font-normal leading-[17.50px] text-zinc-500">
                        {el.name}:
                      </div>
                    </div>
                    <div className="text-right text-sm font-normal leading-[21px] text-zinc-500">${el.grossAmount}</div>
                  </div>

                  {el?.discountAmount ? (
                    <div className="inline-flex items-center justify-start gap-[100px] self-stretch">
                      <div className="flex shrink grow basis-0 items-center justify-start gap-[9px]">
                        <div className="shrink grow basis-0 break-all text-sm font-normal leading-[17.50px]  text-zinc-500 ">
                          {data.discount.name} ({data?.discount?.type === 'FixedDiscount' ? '$' : '%'}
                          {data.discount.amount}):
                        </div>
                      </div>
                      <div className="min-w-[80px] text-right text-sm font-normal leading-[21px] text-zinc-500">
                        ${el.discountAmount ?? 0}
                      </div>
                    </div>
                  ) : (
                    ''
                  )}

                  <div className="mb-3 w-full border-b border-neutral-600 pt-3"></div>
                </div>
              ))}
              <div className="inline-flex h-9 w-full flex-col items-start justify-start gap-2.5">
                <div className="inline-flex items-center justify-between gap-[186px] self-stretch">
                  <div className="shrink grow basis-0 text-base font-normal leading-tight text-white">
                    {t('plan.amountScheduled')}
                  </div>
                  <div className="text-right text-2xl font-normal leading-9 text-white">
                    ${data?.paymentAmount?.paymentAmount ?? 0}
                  </div>
                </div>
              </div>
            </div>
          )}
          {data?.paymentAmount?.extraProtection && (
            <div className="mt-10 flex w-full flex-col">
              <div className="inline-flex items-center justify-start gap-[160px] self-stretch">
                <div className="flex h-[18px] shrink grow basis-0 items-center justify-start gap-[9px]">
                  <div className="shrink grow basis-0 text-sm font-normal leading-[17.50px] text-zinc-500">
                    {data?.paymentAmount?.extraProtection?.name || ''}
                  </div>
                </div>
                <div className="text-right text-sm font-normal leading-[21px] text-zinc-500">
                  {' '}
                  ${data?.paymentAmount?.extraProtection?.netAmount || 0}
                </div>
              </div>

              <div className="mb-3 w-full border-b border-neutral-600 pt-3"></div>

              <div className="inline-flex h-9 w-full flex-col items-start justify-start gap-2.5">
                <div className="inline-flex items-center justify-between gap-[186px] self-stretch">
                  <div className="shrink grow basis-0 text-base font-normal leading-tight text-white">
                    {t('plan.amountScheduled')}
                  </div>
                  <div className="text-right text-2xl font-normal leading-9 text-white">
                    ${data?.paymentAmount?.extraProtection?.netAmount ?? 0}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="order-last flex flex-row items-end gap-8">
          {actions?.map((action: any, index: number) => {
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
    </>
  );
}

StoragePlan.getLayout = PatientProfilePageLayout;

export default StoragePlan;
