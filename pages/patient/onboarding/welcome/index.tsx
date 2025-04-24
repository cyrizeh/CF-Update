import OnboardingCard from '@/features/Onboarding/OnboardingCard';
import { useRouter } from 'next/router';
import { useGetOnboardingData } from '@/api/queries/onboarding.queries';
import arrowNextIcon from '@/public/icons/arrow-right.svg';
import useTranslation from 'next-translate/useTranslation';
import { Spinner } from 'flowbite-react';
import OnboardingLayoutWithNoSSR from '@/components/OnboardingLayout/OnboardingLayoutWithNoSSR';

function WelcomePage() {
  const { t } = useTranslation('onboarding');
  const router = useRouter();

  const { data: onboardingData, isLoading } = useGetOnboardingData();

  const handleGetStartedClick = () => {
    //@ts-ignore
    if (onboardingData?.status === 'Onboarded') {
      router.push(`/patient/onboarding/congrats`);
    } else {
      const id = onboardingData?.currentStep?.id ?? 'plan';
      router.push(`/patient/onboarding/${id}`);
    }
  };
  if (isLoading) {
    return (
      <div className="text-center">
        <Spinner />
      </div>
    );
  }

  // to prevent completed user to go to this page
  if (onboardingData?.status === 'Onboarded') {
    router.push(`/patient/overview`);
  }

  return (
    onboardingData &&
    onboardingData?.status !== 'Onboarded' && (
      <OnboardingCard
        title="Welcome to CryoFuture"
        description={onboardingData.welcomeScreen?.description}
        videoUrl={onboardingData.welcomeScreen?.videoUrl}
        actions={[
          {
            label: t('get_started'),
            onClick: handleGetStartedClick,
            icon: arrowNextIcon,
            isIconPostfix: true,
            isFlat: false,
            isDisabled: false,
          },
        ]}
        withContacts={true}
        supportContact={onboardingData?.supportContact}
      />
    )
  );
}

export default WelcomePage;

WelcomePage.getLayout = (page: any) => <OnboardingLayoutWithNoSSR>{page}</OnboardingLayoutWithNoSSR>;
