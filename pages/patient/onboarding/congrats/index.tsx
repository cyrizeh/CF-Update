import Congrats from '@/features/Onboarding/Congrats';
import OnboardingLayoutWithNoSSR from '@/components/OnboardingLayout/OnboardingLayoutWithNoSSR';

function CongratsPage() {
  return <Congrats />;
}

CongratsPage.getLayout = (page: any) => <OnboardingLayoutWithNoSSR>{page}</OnboardingLayoutWithNoSSR>;

export default CongratsPage;
