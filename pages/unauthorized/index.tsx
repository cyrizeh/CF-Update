import OnboardingLayoutWithNoSSR from '@/components/OnboardingLayout/OnboardingLayoutWithNoSSR';
import Image from 'next/image';
import arrowBackIcon from '@/public/icons/arrow-left-primary.svg';
import { Button } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import logoWithText from '@/public/icons/logoWithText.svg';
import router from 'next/router';

function UnauthorizedPage() {
  const { t } = useTranslation('unauthorized');

  const handleReturnHome = () => {
    router.push(`/`);
  };

  return (
    <div className="m-4 flex items-start justify-center md:items-center md:justify-center">
      <div className="flex w-[666px] flex-col items-center justify-center  gap-8">
        <Image priority src={logoWithText} alt={'Logo'} />
        <div className="bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-center text-[36px] font-light leading-[60px] text-transparent md:flex-row md:items-center ">
          {t('title')}
        </div>
        <div className="text-center text-sm font-light text-white">
          {t('description')}
          <a href="mailto: support@cryofuture.com" className="underline underline-offset-2">
            support@cryofuture.com
          </a>
        </div>

        <Button className="border-0 p-1 lg:block" size={'lg'} gradientDuoTone="primary" onClick={handleReturnHome}>
          <Image priority src={arrowBackIcon} alt={'Return home'} />
          <div className="m-2">{t('return_button')} </div>
        </Button>
      </div>
    </div>
  );
}

UnauthorizedPage.getLayout = (page: any) => <OnboardingLayoutWithNoSSR>{page}</OnboardingLayoutWithNoSSR>;

export default UnauthorizedPage;
