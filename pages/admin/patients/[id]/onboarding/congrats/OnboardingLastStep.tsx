import { useRouter } from 'next/router';
import { Button } from 'flowbite-react';
import Image from 'next/image';

import logoWithText from '@/public/icons/logoWithText.svg';

const OnboardingLastStep = () => {
  const router = useRouter();
  const patientId = router?.query?.id as string;

  return (
    <div className="relative  gap-8 rounded-lg border-[1px] px-4 py-8 text-base font-normal shadow-md transition md:px-8 md:py-10 dark:border-teal-400 dark:bg-cryo-grey dark:text-neutral-50 ">
      <div className="gap-4items-start m-4 flex flex-col justify-center gap-8 md:items-center md:justify-center">
        <div className="flex w-[666px] flex-col items-center justify-center  ">
          <Image priority src={logoWithText} alt={'Logo'} />
          <div className="text-center text-[18px] font-light text-white">
            {'The patient has been successfully onboarded.'}
          </div>
        </div>
        <Button
          className=" border-0 p-1  lg:block"
          size="md"
          gradientDuoTone={'primary'}
          onClick={() => {
            router.push(`/admin/patients/${patientId}/general`);
          }}>
          <div className="flex gap-2">
            <div className="m-2">{"Go to patient's page"}</div>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default OnboardingLastStep;
