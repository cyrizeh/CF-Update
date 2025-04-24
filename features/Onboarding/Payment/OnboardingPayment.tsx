import usePatientPaymentMutation from '@/api/mutations/usePatientPaymentMutation';
import { useGetOnboardingData } from '@/api/queries/onboarding.queries';
import { useGetPatientInfo, useGetPaymentInfo } from '@/api/queries/patient.queries';
import { BillingAgreements } from '@/features/Onboarding/BillingAgreements';
import PatientBillingFormSquare from '@/features/Patients/PatientBilling/PatientBiilingFormSquare/PatientBiilingFormSquare';
import ServicePrices from '@/pages/patient/onboarding/ServicePrices';
import arrowBackIcon from '@/public/icons/arrow-left-primary.svg';
import { OnboardingType } from '@/types/view/OnBoardingType.type';
import { PaymentSquareRequest } from '@/types/view/PatientPaymentDateSource.type';
import { formatDateWithSlashSeparator } from '@/utils/formatDateWithSlashSeparator';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ActionButtons } from './ActionButtons';
import { ExtraProtection } from './ExtraProtection';
import { PaymentButtonGroup } from './PaymentButtonGroup';
import { PaymentSummary } from './PaymentSummary';
import { ViewTypes } from '@/types';
import { handleBackendErrors } from '@/utils/handleBackendErrors';

const getSortedSteps = (steps: ViewTypes.OnboardingStep[]) => {
  return steps.sort((a, b) => a.order - b.order);
};

const OnboardingPayment: React.FC = () => {
  const { t } = useTranslation('onboarding');
  const [payTime, setPayTime] = useState('now');
  const router = useRouter();
  const { id: stepId } = router.query;
  const [isSignupPatient, setIsSignupPatient] = useState(false);

  const { data: patient } = useGetPatientInfo();
  const { data: onboardingData } = useGetOnboardingData();
  const { data } = useGetPaymentInfo();

  const [currentStep, setCurrentStep] = useState<ViewTypes.OnboardingStep>();
  const [steps, setSteps] = useState<ViewTypes.OnboardingStep[]>([]);

  useEffect(() => {
    if (patient) {
      setIsSignupPatient(patient?.isSignup);
    }
  }, [patient]);

  useEffect(() => {
    if (!data?.payNowEnabled && data?.schedulePaymentEnabled) {
      setPayTime('schedule');
    }
  }, [data]);

  useEffect(() => {
    if (onboardingData) {
      setCurrentStep(onboardingData?.steps.find(step => step.id === stepId));
      setSteps(getSortedSteps(onboardingData?.steps));
    }
  }, [onboardingData, stepId]);

  const { handlePayNow, handleSchedulePayment } = usePatientPaymentMutation();

  const handleSubmit = async ({ paymentMethodToken, verificationToken }: PaymentSquareRequest) => {
    try {
      const response =
        payTime === 'now'
          ? await handlePayNow.trigger({ paymentMethodToken, verificationToken })
          : await handleSchedulePayment.trigger({ paymentMethodToken, verificationToken });

      if (response && response?.data.succeeded === false) {
        const errorMessages = response?.data?.errors?.join(', ');
        toast.error(`${t('failed_billing')}: ${errorMessages}`);
      }
      return response;
    } catch (reason: any) {
      if (reason?.response?.data?.errors) {
        handleBackendErrors(reason.response.data.errors);
      } else {
        toast.error(`${t('failed_billing')}`);
      }
    }
  };

  const handleDonePayment = useCallback(() => {
    router.push(`/patient/onboarding/congrats`);
  }, [router]);

  const actions = [
    {
      label: t('back'),
      onClick: () => {
        const lastStepId = onboardingData?.steps
          ? steps?.find(item => item?.order === Number(currentStep?.order) - 1)?.id
          : null;
        const route = lastStepId ? `/patient/onboarding/${lastStepId}` : `/patient/onboarding/welcome`;
        router.push(route);
      },
      icon: arrowBackIcon,
      isIconPostfix: false,
      isFlat: true,
      isDisabled: false,
    },
  ];

  if (onboardingData?.status === 'Onboarded') {
    router.push(`/patient/overview`);
    return null;
  }

  if (onboardingData?.onboardingType === OnboardingType.ExistingPatient) {
    router.push(`/patient/onboarding/schedule-payment`);
    return null;
  }

  if (data && onboardingData?.status !== 'Onboarded') {
    return (
      <div className="grid-rows-[repeat(3,_minmax(0,_auto)] md:grid-rows-[repeat(2,_minmax(0,_auto)] relative grid grid-cols-1 gap-8 rounded-lg border-[1px] px-4 py-8 text-base font-normal shadow-md transition md:grid-cols-2 md:px-8 md:py-10 dark:border-teal-400 dark:bg-cryo-grey dark:text-neutral-50">
        <div className="max-w-[450px]">
          <div className="mb-3 bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-[36px] font-light leading-[60px] text-transparent md:flex-row md:items-center">
            {isSignupPatient ? 'Enter your Credit/Debit Card information' : 'Pay with Credit/Debit Card'}
          </div>
          <BillingAgreements
            isPayNow={payTime === 'now'}
            paymentdateSource={data?.paymentDateSource}
            isPreTreatment={onboardingData?.isPreTreatment || false}
            isSignupPatient={isSignupPatient}
            hasSpecimens={patient?.signupSetup?.hasSpecimens}
          />
        </div>

        <div className="relative min-h-[330px] md:row-span-2">
          <div className="relative w-full max-w-[666px]">
            <PaymentButtonGroup
              payTime={payTime}
              setPayTime={setPayTime}
              payNowEnabled={data?.payNowEnabled}
              schedulePaymentEnabled={data?.schedulePaymentEnabled}
              isSignupPatient={isSignupPatient}
            />

            <PatientBillingFormSquare
              btnLabel={
                data?.paymentAmount?.totalAmount
                  ? payTime === 'now'
                    ? `Pay now - $${data?.paymentAmount?.totalAmount}`
                    : `Schedule Payment - $${data?.paymentAmount?.totalAmount} ${
                        data?.billingDate ? `on ${formatDateWithSlashSeparator(data?.billingDate)}` : ''
                      }`
                  : 'Pay'
              }
              total={data?.paymentAmount?.totalAmount}
              handleDone={handleDonePayment}
              handlePayment={handleSubmit}
              isSignupPatient={isSignupPatient}
            />
          </div>

          {isSignupPatient && !onboardingData?.showPlanSelection ? (
            <div className="mb-3 mt-5 md:flex-row md:items-center">
              <p className="mb-3 text-xs font-semibold dark:text-gray-400">
                {t('payments.schedulePayment.pricingTableDescription')}
              </p>
              <ServicePrices />
            </div>
          ) : (
            <>
              <PaymentSummary paymentAmount={data?.paymentAmount} payTime={payTime} />
              <ExtraProtection extraProtection={data?.paymentAmount?.extraProtection} payTime={payTime} />
            </>
          )}
        </div>

        <ActionButtons actions={actions} />
      </div>
    );
  }

  return null;
};

export default OnboardingPayment;
