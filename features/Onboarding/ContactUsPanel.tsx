import { Button } from 'flowbite-react';
import { HiOutlineMail } from 'react-icons/hi';
import useTranslation from 'next-translate/useTranslation';

const ContactUsPanel = () => {
  const { t } = useTranslation('onboarding');
  return (
    <div className="flex items-center justify-between px-4 pb-3  pt-4 text-sm font-light  text-white  md:justify-end md:px-0">
      <p>{t('contact_us_description')}</p>
      <Button
        as="a"
        href="mailto: support@cryofuture.com"
        color={'outlineOne'}
        size="md"
        className="ml-3 grow md:grow-0">
        <HiOutlineMail className="mr-2" />
        {t('contact_us_button')}
      </Button>
    </div>
  );
};

export default ContactUsPanel;
