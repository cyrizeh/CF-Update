import { PatientOverviewProps } from '@/types/view';
import useTranslation from 'next-translate/useTranslation';
import React from 'react';

const PatientLabels: React.FC<PatientOverviewProps> = ({ patient }) => {
  const { t } = useTranslation('patients');
  if (!patient) {
    return null;
  }

  return (
    <div className="mt-3 flex flex-row flex-wrap gap-3 px-3">
      <div className="inline-flex items-center gap-2 rounded-md border border-transparent p-3 text-sm font-normal leading-tight text-gray-300 dark:bg-[#292B2C]">
        <div>{patient?.isPrimaryPayer ? t('isPrimaryPayer.patient') : t('isPrimaryPayer.co-patient')}</div>
      </div>
      {patient?.hasReactiveSpecimens && (
        <div className="inline-flex items-center gap-2 rounded-md border border-transparent p-3 text-sm font-semibold leading-tight text-gray-300 dark:bg-red-600">
          <div>{t('hasReactiveSpecimens')}</div>
        </div>
      )}
    </div>
  );
};

export default PatientLabels;
