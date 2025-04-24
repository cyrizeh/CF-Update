/* eslint-disable camelcase */
import classNames from 'classnames';
import { Button, Spinner } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

import OnboardingLayoutWithNoSSR from '@/components/OnboardingLayout/OnboardingLayoutWithNoSSR';

import arrowBackIcon from '@/public/icons/arrow-left-primary.svg';

import { axiosInstance } from '@/api/axiosConfig';
import { useGetTransportations } from '@/api/queries/patient.queries';
import PatientBillingFormSquare from '@/features/Patients/PatientBilling/PatientBiilingFormSquare/PatientBiilingFormSquare';
import usePatientPaymentMutation from '@/api/mutations/usePatientPaymentMutation';
import { toast } from 'react-toastify';
import { PaymentSquareRequest } from '@/types/view/PatientPaymentDateSource.type';
import ContactUsPanel from '@/features/Onboarding/ContactUsPanel';
import { Payer } from '@/types/view/Payer.enum';

// eslint-disable-next-line complexity
function StoragePlan() {
  const { t } = useTranslation('onboarding');

  const [paymentDetails, setPaymentDetails] = useState<any>({});
  const { data: transportationsData, isLoading: transportationDataLoading } = useGetTransportations();
  const { handleTransportationOnBoardingPayment } = usePatientPaymentMutation();
  const signingStatus = localStorage.getItem('signingStatus');
  const transportationId = transportationsData?.items[0]?.transportationRequestId;

  const getTransportationInfo = useCallback(async () => {
    const { data: patient } = transportationId
      ? await axiosInstance.get(`patients/transportations/${transportationId}`)
      : { data: null };
    setPaymentDetails(patient?.paymentDetails);
  }, [transportationId]);

  useEffect(() => {
    if (transportationId) getTransportationInfo();
  }, [transportationId]);

  const router = useRouter();

  const actions = [
    {
      label: t('back'),
      onClick: () => {
        router.push(`/transportation/onboarding/${transportationsData?.items[0]?.transportationRequestId}`);
      },
      icon: arrowBackIcon,
      isIconPostfix: false,
      isFlat: true,
      isDisabled: false,
    },
  ];

  const handleDonePayment = useCallback(() => {
    router.push(`/transportation/onboarding/congrats`);
  }, [router]);

  const handlePayment = async ({ paymentMethodToken, verificationToken }: PaymentSquareRequest) => {
    const response = await handleTransportationOnBoardingPayment
      .trigger({ paymentMethodToken, verificationToken, transportationRequestId: transportationId })
      .catch(() => {
        toast.error(`${t('failed_billing')}`);
      });
    return response;
  };

  if (transportationsData) {
    const id = transportationsData?.items[0]?.transportationRequestId;
    if (
      transportationsData?.items[0]?.paymentStatus === 'Paid' &&
      transportationsData?.items[0]?.payer === Payer.Patient
    ) {
      router.push(`/transportation/overview`);
    } else if (signingStatus !== 'completed' && transportationsData?.items[0]?.documentStatus !== 'Completed' && id) {
      router.push(`/transportation/onboarding/${id}`);
    } else if (
      transportationsData?.items[0]?.payer === Payer.Clinic ||
      transportationsData?.items[0]?.payer === Payer.Progyny
    ) {
      router.push(`/transportation/onboarding/noPayment`);
    }
  }

  if (transportationDataLoading) {
    return (
      <div className="absolute z-20 flex h-full w-full items-center justify-center rounded-lg	bg-black/10 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-2 text-sm text-white">
          <Spinner size="sm" className="mt-[-1px]" /> Loading...
        </div>
      </div>
    );
  }

  if (paymentDetails)
    return transportationsData?.items?.length > 0 ? (
      <>
        <div className="grid-rows-[repeat(3,_minmax(0,_auto)] md:grid-rows-[repeat(2,_minmax(0,_auto)] relative grid grid-cols-1 gap-8 rounded-lg border-[1px] px-4 py-8 text-base font-normal shadow-md transition md:grid-cols-2 md:px-8 md:py-10 dark:border-teal-400 dark:bg-cryo-grey dark:text-neutral-50 ">
          <div className="max-w-[450px]">
            <div className="flex">
              <div className="mb-3  bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-[36px] font-light leading-[60px] text-transparent md:flex-row md:items-center ">
                {t('transportation.step2.title')}
              </div>
            </div>
            <div className="text-4 mb-8 font-light">{t('transportation.step2.description1')} </div>
            <div className="text-4 font-light">{t('transportation.step2.description2')} </div>
          </div>

          <div className="relative min-h-[330px] md:row-span-2">
            <div className="relative w-full max-w-[666px]">
              <PatientBillingFormSquare
                btnLabel={paymentDetails?.paymentAmount ? `Pay - $${paymentDetails?.paymentAmount}` : 'Pay'}
                total={paymentDetails?.paymentAmount}
                handleDone={handleDonePayment}
                handlePayment={handlePayment}
              />
            </div>
            <>
              {paymentDetails && (
                <div className="mt-8">
                  {paymentDetails?.invoiceLines?.map((el: any, index: number) => (
                    <div key={el.name + index + el.grossAmount} className="flex w-full flex-col">
                      <div className="inline-flex items-center justify-start gap-[160px] self-stretch">
                        <div className="flex shrink grow basis-0 items-center justify-start gap-[9px] lg:h-[18px]">
                          <div className="shrink grow basis-0 text-sm font-normal leading-[17.50px] text-zinc-500">
                            {el.name}:
                          </div>
                        </div>
                        <div className="text-right text-sm font-normal leading-[21px] text-zinc-500">
                          ${el.grossAmount}
                        </div>
                      </div>

                      {el?.discountAmount ? (
                        <div className="inline-flex items-center justify-start gap-[100px] self-stretch">
                          <div className="flex shrink grow basis-0 items-center justify-start gap-[9px]">
                            <div className="shrink grow basis-0 break-all text-sm font-normal leading-[17.50px]  text-zinc-500 ">
                              Discount:
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
                        Total Amount:
                      </div>
                      <div className="text-right text-2xl font-normal leading-9 text-white">
                        ${paymentDetails?.paymentAmount ?? 0}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {paymentDetails?.extraProtection && (
                <div className="mt-10 flex w-full flex-col">
                  <div className="inline-flex items-center justify-start gap-[160px] self-stretch">
                    <div className="flex shrink grow basis-0 items-center justify-start gap-[9px] lg:h-[18px]">
                      <div className="shrink grow basis-0 text-sm font-normal leading-[17.50px] text-zinc-500">
                        {paymentDetails?.extraProtection?.name || ''}
                      </div>
                    </div>
                    <div className="text-right text-sm font-normal leading-[21px] text-zinc-500">
                      {' '}
                      ${paymentDetails?.extraProtection?.netAmount || 0}
                    </div>
                  </div>

                  <div className="mb-3 w-full border-b border-neutral-600 pt-3"></div>

                  <div className="inline-flex h-9 w-full flex-col items-start justify-start gap-2.5">
                    <div className="inline-flex items-center justify-between gap-[186px] self-stretch">
                      <div className="shrink grow basis-0 text-base font-normal leading-tight text-white">
                        {t('plan.amountDueNow')}
                      </div>
                      <div className="text-right text-2xl font-normal leading-9 text-white">
                        ${paymentDetails?.extraProtection?.netAmount ?? 0}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
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
        <div className="flex justify-end">
          <ContactUsPanel />
        </div>
      </>
    ) : null;
}

export default StoragePlan;

StoragePlan.getLayout = (page: any) => <OnboardingLayoutWithNoSSR>{page}</OnboardingLayoutWithNoSSR>;
