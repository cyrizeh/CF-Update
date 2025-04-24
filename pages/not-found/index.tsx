import OnboardingLayoutWithNoSSR from '@/components/OnboardingLayout/OnboardingLayoutWithNoSSR';
import Image from 'next/image';
import { Spinner } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import logoWithText from '@/public/icons/logoWithText.svg';
import router from 'next/router';
import { useUser } from '@auth0/nextjs-auth0/client';

function NotFoundPage() {
  const { t } = useTranslation('common');
  const { user, isLoading } = useUser();

  if (user) {
    return router.push(`/`);
  }

  if (isLoading) {
    return (
      <div className="text-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="m-4 flex items-start justify-center md:items-center md:justify-center">
      <div className="flex w-[666px] flex-col items-center justify-center  gap-8">
        <Image priority src={logoWithText} alt={'Logo'} />
        <div className="bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-center text-[36px] font-light leading-[60px] text-transparent md:flex-row md:items-center ">
          {t('notFoundTitle')}
        </div>
        <div className="text-center text-[18px] font-light text-white">
          {t('notFound_description_part1')}
          <div>
            {t('notFound_description_part2')}
            <a href={`tel:+1650-437-0503`}>650-437-0503</a>

            {t('notFound_description_part3')}
            <a href={`mailto: support@cryofuture.com`} className="underline underline-offset-2">
              support@cryofuture.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

NotFoundPage.getLayout = (page: any) => <OnboardingLayoutWithNoSSR>{page}</OnboardingLayoutWithNoSSR>;

export default NotFoundPage;
