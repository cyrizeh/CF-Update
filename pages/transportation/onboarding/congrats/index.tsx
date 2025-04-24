import OnboardingLayoutWithNoSSR from '@/components/OnboardingLayout/OnboardingLayoutWithNoSSR';
import logoWithText from '@/public/icons/logoWithText.svg';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import arrowNextIcon from '@/public/icons/arrow-right.svg';
import { Button } from 'flowbite-react';
import router from 'next/router';

function CongratsPage() {
  const { t } = useTranslation('onboarding');
  const handleGetStartedClick = () => {
    router.push(`/transportation/overview`);
  };

  return (
    <div className="m-auto flex max-w-[500px] flex-col items-center gap-8 rounded-lg px-4 py-8 text-base font-normal md:px-8 md:py-14">
      <div className="center item-center flex justify-center bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-center text-[36px] font-light leading-[60px] text-transparent md:flex-row md:items-center ">
        <Image priority src={logoWithText} alt={'Logo'} />
      </div>

      <div className="text-4 flex max-w-[800px] flex-col gap-3 text-center font-light text-white">
        <p>{t('transportation.step5.title')}</p>
        <p>{t('transportation.step5.description1')}</p>
        <p>{t('transportation.step5.description2')}</p>
      </div>
      <div className="mt-3 flex justify-center">
        <Button className="border-0 p-1 lg:block" size="lg" gradientDuoTone={'primary'} onClick={handleGetStartedClick}>
          <div className="flex gap-2">
            <div>{t('go_to_dashboard')}</div>
            <Image priority src={arrowNextIcon} alt={'Go to dashboard'} />
          </div>
        </Button>
      </div>
    </div>
  );
}

CongratsPage.getLayout = (page: any) => <OnboardingLayoutWithNoSSR>{page}</OnboardingLayoutWithNoSSR>;

export default CongratsPage;
