import OnboardingLayoutWithNoSSR from '@/components/OnboardingLayout/OnboardingLayoutWithNoSSR';
import Image from 'next/image';
import { Button, Spinner } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import logoWithText from '@/public/icons/logoWithText.svg';
import router from 'next/router';
import { useUser } from '@auth0/nextjs-auth0/client';

function LoginPage() {
  const { t } = useTranslation('login');
  const { user, isLoading } = useUser();

  const handleReturnHome = () => {
    router.push(`/`);
  };

  if (user) {
    router.push(`/`);
  }

  if (isLoading) {
    return (
      <div className="text-center">
        <Spinner />
      </div>
    );
  }

  return !user ? (
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
          <div className="m-0">{t('login_button')}</div>
        </Button>
      </div>
    </div>
  ) : null;
}

LoginPage.getLayout = (page: any) => <OnboardingLayoutWithNoSSR>{page}</OnboardingLayoutWithNoSSR>;

export default LoginPage;
