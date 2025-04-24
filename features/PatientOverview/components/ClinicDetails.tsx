import { TableLink } from '@/components/DataGrid/TableComponents';
import useRole from '@/hooks/useRole';
import { UserRole } from '@/types';
import { PatientOverviewProps } from '@/types/view';
import { isUserAccountAdmin, isUserClinicAdmin, isUserPatient } from '@/utils';
import useTranslation from 'next-translate/useTranslation';
import PatientComponentLayout from './PatientComponentLayout';

const ClinicDetails = ({ patient }: PatientOverviewProps) => {
  const { t } = useTranslation('patients');
  const { roles } = useRole();
  const isClinicAdmin = isUserClinicAdmin(roles as UserRole[]);
  const isNetworkAdmin = isUserAccountAdmin(roles as UserRole[]);
  const isPatient = isUserPatient(roles as UserRole[]);
  const isReadOnly = isClinicAdmin || isNetworkAdmin || isPatient;
  const clinicLink = !isReadOnly ? `/admin/clinics/${patient?.clinicId}/general` : undefined;

  return (
    <PatientComponentLayout col>
      <span className="text-2xl font-normal text-white">{t('clinicDetails')}</span>
      <div className="my-2 flex justify-between gap-12 rounded-md border border-transparent px-4 py-3 text-sm font-normal leading-tight text-gray-300 dark:bg-[#292B2C]">
        <div>{t('clinicName')}</div>
        {!isReadOnly ? (
          <TableLink href={clinicLink || ''} name={patient?.clinicName} />
        ) : (
          <div>{patient?.clinicName}</div>
        )}
      </div>
    </PatientComponentLayout>
  );
};

export default ClinicDetails;
