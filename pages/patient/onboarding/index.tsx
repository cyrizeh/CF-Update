import { useRouter } from 'next/router';
import { useGetOnboardingData } from '@/api/queries/onboarding.queries';
import { Spinner } from 'flowbite-react';
import OnboardingLayoutWithNoSSR from '@/components/OnboardingLayout/OnboardingLayoutWithNoSSR';
import { OnboardingType, OnboardingStep } from '@/types/view/OnBoardingType.type';
import { useGetPatientInfo } from '@/api/queries/patient.queries';
import PatientRegistration from '@/features/Patients/PatientRegistration/PatientRegistration';
import { useEffect, useState } from 'react';

const getRedirectPath = (onboardingData: any) => {
  if (!onboardingData) {
    return null;
  }

  const { status, onboardingType, currentStep, steps } = onboardingData;

  if (status === 'Onboarded') {
    return `/patient/overview`;
  }

  if (onboardingType === OnboardingType.ExistingPatient) {
    if (currentStep) {
      const { type } = currentStep;
      switch (type) {
        case OnboardingStep.DataConfirmation:
          return `/patient/onboarding/confirm-details`;
        case OnboardingStep.StoragePlanSelection:
          return `/patient/onboarding/storage-plan`;
        case OnboardingStep.EppAddon:
          return `/patient/onboarding/add-on`;
        case OnboardingStep.PaymentMethodAssignment:
          return `/patient/onboarding/schedule-payment`;
        default:
          break;
      }
    }
  } else {
    if (
      status === 'NotStarted' ||
      (status === 'DocumentsSigned' && onboardingType === OnboardingType.PaymentsOnboardPlusLogin)
    ) {
      return `/patient/onboarding/welcome`;
    }

    if (status !== 'Onboarded' && currentStep) {
      const { id, status: stepStatus, order } = currentStep;

      if (stepStatus !== 'Completed') {
        return `/patient/onboarding/${id}`;
      } else {
        const nextStep = steps.find((step: { order: any }) => step.order === order + 1);

        if (nextStep) {
          return `/patient/onboarding/${nextStep.id}`;
        } else {
          return '/patient/onboarding/congrats';
        }
      }
    }
  }

  return null;
};

function OnboardingPage() {
  const router = useRouter();
  const [isSignupPatient, setIsSignupPatient] = useState(false);

  const { data: patient, mutate: refetchPatient } = useGetPatientInfo();
  const { data: onboardingData, isLoading, mutate } = useGetOnboardingData();

  useEffect(() => {
    if (patient?.patientStatus === 'Draft' && patient.isSignup) {
      setIsSignupPatient(true);
    }
  }, [patient]);

  const redirectPath = getRedirectPath(onboardingData);
  if (redirectPath) {
    router.push(redirectPath);
  }

  if (isLoading && !isSignupPatient) {
    return (
      <div className="absolute z-20 flex h-full w-full items-center justify-center rounded-lg backdrop-blur-sm">
        <div className="flex items-center justify-center gap-2 text-sm text-white">
          <Spinner size="sm" className="mt-[-1px]" /> Loading...
        </div>
      </div>
    );
  }

  return patient?.patientStatus === 'Draft' && patient.isSignup ? (
    <div className="m-4 flex items-start justify-center md:items-center md:justify-center">
      <div className="flex w-[666px] flex-col items-center justify-center  gap-8">
        <PatientRegistration patient={patient} refetchOnboardingData={mutate} refetchPatient={() => refetchPatient()} />
      </div>
    </div>
  ) : null;
}

OnboardingPage.getLayout = (page: any) => <OnboardingLayoutWithNoSSR>{page}</OnboardingLayoutWithNoSSR>;

export default OnboardingPage;
