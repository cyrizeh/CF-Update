import { ViewTypes } from '@/types';
import useTranslation from 'next-translate/useTranslation';
import { formatToUSAPhoneFormat } from '@/utils';

const ContactDetails = ({ contactDetails, contact }: { contactDetails: ViewTypes.ContactDetails; contact: string }) => {
  const { t } = useTranslation('clinics');

  if (!contactDetails) {
    return null;
  }

  const { firstName, lastName, email, phoneNumber, jobTitle } = contactDetails;

  const details = [
    { label: t('common:jobTitle'), value: jobTitle, testId: 'job-title' },
    {
      label: t('common:name'),
      value: `${firstName ? firstName : ''} ${lastName ? lastName : ''}`.trim() || '-',
      testId: 'name',
    },
    { label: t('common:email'), value: email, testId: 'email' },
    {
      label: t('common:phone'),
      value: phoneNumber ? formatToUSAPhoneFormat(phoneNumber) : '-',
      testId: 'phone',
    },
  ];

  return (
    <div
      className="flex w-full justify-between rounded-lg bg-[#292B2C] px-4 py-3"
      data-testid={`${contact.toLowerCase()}-contact-details`}>
      <div className="flex w-full flex-col gap-2.5 text-sm leading-[125%] text-[#D1D5DB]">
        <div className="font-inter font-normal">
          {contact} {t('common:contact')}
        </div>
        <div className="overflow-wrap-all flex flex-col gap-1 font-medium">
          {details.map((detail, index) => (
            <div key={index} data-testid={`${contact.toLowerCase()}-${detail.testId}`}>
              {detail.label}: {detail.value ? detail.value : '-'}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactDetails;
