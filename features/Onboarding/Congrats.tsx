import arrowNextIcon from '@/public/icons/arrow-right.svg';
import { Button } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import router from 'next/router';
import { Spinner } from 'flowbite-react';
import { useGetOnboardingData } from '@/api/queries/onboarding.queries';
import Image from 'next/image';
import ReactPlayer from 'react-player';
import { HiOutlineMail, HiOutlinePhone } from 'react-icons/hi';

const Congrats = () => {
  const { t } = useTranslation('onboarding');
  const handleGetStartedClick = () => {
    router.push(`/patient/overview`);
  };

  const { data: onboardingData, isLoading } = useGetOnboardingData();

  if (isLoading) {
    return (
      <div className="text-center">
        <Spinner />
      </div>
    );
  }

  return onboardingData ? (
    <div className="grid-rows-[repeat(3,_minmax(0,_auto)] md:grid-rows-[repeat(2,_minmax(0,_auto)] grid grid-cols-1 gap-0 rounded-lg border-[1px] px-4 py-8 text-base font-normal shadow-md transition md:grid-cols-2 md:px-8 md:py-14 dark:border-teal-400 dark:bg-cryo-grey dark:text-neutral-50">
      <div className="">
        <div className="mb-3 bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-[36px] font-light leading-[60px] text-transparent md:flex-row md:items-center ">
          {onboardingData.thankYouScreen?.title}
        </div>
        <div className="text-4 mb-3 font-light">{onboardingData.thankYouScreen?.description}</div>
      </div>
      <div className="md:row-span-2">
        <div className="relative max-w-[747px]">
          <ReactPlayer
            controls
            playsinline
            // config={{ file: { forceDASH: true } }}
            url={onboardingData.thankYouScreen?.videoUrl}
            width="100%"
          />
        </div>
      </div>
      <div className="order-last mt-8 flex flex-row items-end justify-between gap-8">
        <div className="w-full">
          <Button
            className=" border-0 p-1  lg:block"
            size="lg"
            gradientDuoTone={'primary'}
            onClick={handleGetStartedClick}>
            <div className="flex gap-2">
              <div className="m-2">{t('complete_onboarding')}</div>
              <Image priority src={arrowNextIcon} alt={'Get started'} />
            </div>
          </Button>
          {!!onboardingData?.supportContact && (
            <div className="mr-3">
              <hr className="my-8 h-px border-0 bg-gray-200 dark:bg-gray-700"></hr>
              <div className="flex items-center justify-start">
                <HiOutlineMail className="mr-3" />
                <a href={`mailto: ${onboardingData?.supportContact?.email}`} className="underline underline-offset-2">
                  {onboardingData?.supportContact?.email}
                </a>
              </div>
              <div className="flex items-center justify-start">
                <HiOutlinePhone className="mr-3" />
                <a href={`tel:+1${onboardingData?.supportContact?.phoneNumber}`}>{onboardingData?.supportContact?.phoneNumber}</a>

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : null;
};

export default Congrats;
