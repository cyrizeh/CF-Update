import dynamic from 'next/dynamic';

const OnboardingLayoutWithNoSSR = dynamic(() => import('./OnboardingLayout'), {
  ssr: false,
});

export default OnboardingLayoutWithNoSSR;
