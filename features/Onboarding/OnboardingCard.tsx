import { Button } from 'flowbite-react';
import Image from 'next/image';
import { ViewTypes } from '@/types';
import classNames from 'classnames';
import ReactPlayer from 'react-player';
import { useState } from 'react';
import ContactUsPanel from './ContactUsPanel';
import { HiOutlinePhone } from 'react-icons/hi';
import { HiOutlineMail } from 'react-icons/hi';
import useTranslation from 'next-translate/useTranslation';
import { Spinner } from 'flowbite-react';

const OnboardingCard = ({
  title,
  description,
  videoUrl,
  actions,
  withContacts,
  showNewWindow,
  supportContact,
}: ViewTypes.OnboardingCard) => {
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation('onboarding');

  const formatDescription = (text: string): JSX.Element[] => {
    const lines = text.split(/\n|\\n/);
    return lines.map((item, index) => (
      <p key={index} className={item.trim() === '' ? 'h-2' : undefined}>
        {item}
      </p>
    ));
  };
  return (
    <div>
      <div className="grid-rows-[repeat(3,_minmax(0,_auto)] md:grid-rows-[repeat(2,_minmax(0,_auto)] grid grid-cols-1 gap-8 rounded-lg border-[1px] px-4 py-8 text-base font-normal shadow-md transition md:grid-cols-2 md:px-8 md:py-10 dark:border-teal-400 dark:bg-cryo-grey dark:text-neutral-50">
        <div className="">
          <div className="mb-3 bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-[36px] font-light leading-[60px] text-transparent md:flex-row md:items-center ">
            {title}
          </div>
          <div className="text-4 mb-3 font-light">{formatDescription(description)}</div>
          {withContacts && !!supportContact && (
            <>
              <hr className="my-6 h-px border-0 bg-gray-200 dark:bg-gray-700"></hr>
              {supportContact?.email && (
                <div className="flex items-center justify-start">
                  <HiOutlineMail className="mr-3" />
                  <a href={`mailto: ${supportContact?.email}`} className="underline underline-offset-2">
                    {supportContact?.email}
                  </a>
                </div>
              )}
              {supportContact?.phoneNumber && (
                <div className="flex items-center justify-start">
                  <HiOutlinePhone className="mr-3" />
                  <a href={`tel:+1${supportContact?.phoneNumber}`}>{supportContact?.phoneNumber}</a>
                </div>
              )}
            </>
          )}
        </div>
        <div className="md:row-span-2">
          <div className="relative max-h-[434px] max-w-[747px]">
            <ReactPlayer
              controls
              playsinline
              // config={{ file: { forceDASH: true } }}
              url={`${videoUrl}`}
              width="100%"
              onEnded={() => {
                setIsVideoEnded(true);
              }}
            />
          </div>
          {showNewWindow && (
            <div className="mt-6 flex items-center justify-end gap-4">
              <div>{t('card.description')}</div>
              <Button
                className="w-[120px]"
                outline
                gradientDuoTone="primary"
                onClick={() => {
                  if (videoUrl) {
                    setIsVideoEnded(true);
                    window.open(videoUrl, '_blank');
                  }
                }}>
                <div className="mr-2"></div>
                {t('card.newWindow')}
              </Button>
            </div>
          )}
        </div>
        <div className="order-last mb-3 flex flex-row items-end justify-between gap-8">
          {actions?.map((action: any, index: number) => {
            return (
              <Button
                className={classNames('border-0 p-1 lg:block', { 'flex-row-reverse': action.isIconPostfix })}
                size="lg"
                gradientDuoTone={action.isFlat ? 'transparent' : 'primary'}
                onClick={() => {
                  action.onClick();
                  setIsLoading(true);
                }}
                key={index + action.label}
                isProcessing={action.isProcessing}
                disabled={isLoading || action.isDisabled}>
                <div className={classNames('flex gap-2', { 'flex-row-reverse': action.isIconPostfix })}>
                  {!isLoading ? <Image priority src={action.icon} alt={action.label} /> : <Spinner size="sm" />}
                  <div>{action.label}</div>
                </div>
              </Button>
            );
          })}
        </div>
      </div>
      <div className="flex w-full justify-end">
        <ContactUsPanel />
      </div>
    </div>
  );
};

export default OnboardingCard;
