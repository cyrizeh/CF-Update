import { PatientOverviewProps } from '@/types/view';

import PatientComponentLayout from './PatientComponentLayout';

import useTranslation from 'next-translate/useTranslation';

const EmergencyContact = ({ patient }: PatientOverviewProps) => {
  const { t } = useTranslation('patients');

  const details = [
    {
      name: 'Name',
      value: patient.emergencyContact?.name,
      sensitive: true,
    },
    {
      name: 'Email',
      value: patient.emergencyContact?.email,
      sensitive: true,
    },
    {
      name: 'Address',
      value: patient.emergencyContact?.address,
    },
  ];

  return (
    <PatientComponentLayout col>
      <div className="mb-6 flex items-center justify-between">
        <span className=" text-2xl font-normal text-white">{t('emergencyContact')}</span>
      </div>

      {details.map(
        ({ name, value, sensitive }: any) =>
          value && (
            <div
              key={name}
              className="overflow-wrap-all my-2 flex justify-between gap-12 rounded-md border border-transparent px-4 py-3 text-sm font-normal leading-tight text-gray-300 dark:bg-[#292B2C]">
              <div className="min-w-16 ">{name}</div>
              <div className={`min-w-16 ${sensitive ? 'sensitive' : ''}`}>{value}</div>
            </div>
          )
      )}
    </PatientComponentLayout>
  );
};

export default EmergencyContact;
