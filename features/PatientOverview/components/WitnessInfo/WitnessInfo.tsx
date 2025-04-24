import { PatientOverviewProps } from '@/types/view';
import useTranslation from 'next-translate/useTranslation';
import PatientComponentLayout from '../PatientComponentLayout';

const WitnessInfo = ({ patient }: PatientOverviewProps) => {
  const { t } = useTranslation('patients');
  return (
    <PatientComponentLayout col>
      <span className="text-2xl font-normal text-white">{t('witness')}</span>
      <div className="my-2 flex justify-between gap-12 rounded-md border border-transparent px-4 py-3 text-sm font-normal leading-tight text-gray-300 dark:bg-[#292B2C]">
        <div>{t('witnessName')}</div>
        <div>{patient?.witnessName}</div>
      </div>
    </PatientComponentLayout>
  );
};

export default WitnessInfo;
