import PatientComponentLayout from './PatientComponentLayout';
import { Button } from 'flowbite-react';
import { useGetOnboardingData } from '@/api/queries/onboarding.queries';
import OnboardingTasks from './OnboardingTasks';
import { Progress } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { OnboardingTask } from '@/types/view';
import router from 'next/router';

const Onboarding = () => {
  const { data: onboardingData } = useGetOnboardingData();

  const [comletedSteps, setCompletedSteps] = useState<OnboardingTask[]>([]);
  const [unComletedSteps, setUnCompletedSteps] = useState<OnboardingTask[]>([]);

  useEffect(() => {
    if (onboardingData) {
      const steps = onboardingData.steps
        .filter(steps => steps.type !== 'DataConfirmationStep')
        .map(step => {
          return {
            id: step.id,
            status: step.status,
            name: step.name,
            order: step.order,
          };
        });
      const completedSteps = steps.filter(step => step.status === 'Completed');
      setCompletedSteps(completedSteps);
      const unCompletedSteps = steps.filter(step => step.status !== 'Completed');
      setUnCompletedSteps(unCompletedSteps);
    }
  }, [onboardingData]);

  const startOnboarding = () => () => {
    router.push(`/patient/onboarding`);
  };

  return (
    <PatientComponentLayout col>
      <div className="flex  flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="text-2xl font-normal text-white">Onboarding Progress</p>
          {onboardingData?.status !== 'Onboarded' ? (
            <Button gradientDuoTone="primary" onClick={startOnboarding()}>
              <div className="mr-2"></div>
              {onboardingData?.status === 'NotStarted' ? 'Start Onboarding' : 'Continue Onboarding'}
            </Button>
          ) : null}
        </div>
        <Progress
          color="cryo"
          progress={(comletedSteps.length * 100) / (comletedSteps.length + unComletedSteps.length)}
        />

        <OnboardingTasks label="Incomplete Onboarding Tasks" steps={unComletedSteps} />
        <OnboardingTasks label="Complete Onboarding Tasks" steps={comletedSteps} />
      </div>
    </PatientComponentLayout>
  );
};

export default Onboarding;
