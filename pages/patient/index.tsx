import { useGetPatientInfo } from '@/api/queries/patient.queries';
import OnboardingLayoutWithNoSSR from '@/components/OnboardingLayout/OnboardingLayoutWithNoSSR';
import { OnboardingStatusResponse } from '@/types/Patients.enum';
import { OnboardingType } from '@/types/view/OnBoardingType.type';
import { Spinner } from 'flowbite-react';
import { useRouter } from 'next/router';

const getRedirectPath = (patient: any) => {
  if (!patient) {
    return null;
  }

  if (
    patient?.onboardingStatus === 'NotStarted' ||
    (patient?.patientStatus === 'Draft' && patient.isSignup) ||
    (patient?.onboardingStatus === OnboardingStatusResponse.DocumentsSigned && // first step for PaymentsOnboardPlusLogin
      patient?.onboardingType === OnboardingType.PaymentsOnboardPlusLogin)
  ) {
    return `/patient/onboarding`;
  } else {
    return `/patient/overview`;
  }
};

function PatientPage() {
  const router = useRouter();
  const { data: patient, isLoading } = useGetPatientInfo();

  const redirectPath = getRedirectPath(patient);
  if (redirectPath) {
    router.push(redirectPath);
  }

  return isLoading ? (
    <div className="absolute z-20 flex h-full w-full items-center justify-center rounded-lg	backdrop-blur-sm">
      <div className="flex items-center justify-center gap-2 text-sm text-white">
        <Spinner size="sm" className="mt-[-1px]" /> Loading...
      </div>
    </div>
  ) : null;
}

PatientPage.getLayout = (page: any) => <OnboardingLayoutWithNoSSR>{page}</OnboardingLayoutWithNoSSR>;

export default PatientPage;
