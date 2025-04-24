import styles from './PatienstListTable.module.css';
import { patientStatus } from '@/features/Patients/PatientsList/patient.utils';
import { ViewTypes } from '@/types';
import Checkbox from '@/components/Forms/Checkbox/Checkbox';
import Link from 'next/link';

import { Badge } from '@/components/Badge/Badge';
import { PatientOnboardingColor, PatientOnboardingStatus } from '../../../types/Patients.enum';
import { Spinner } from 'flowbite-react';
import _ from 'lodash';
import {
  buildAccountPatientProfilePageRoute,
  buildAdminGeneralPatientPageRoute,
  buildClinicPatientProfilePageRoute,
} from '@/constants/buildRoutes';
import { toPascalCase } from '@/utils/toPascalCase';
import useTranslation from 'next-translate/useTranslation';
import { getSpecimenLabels } from '@/utils/getSpecimenLabels';

export const PatientsListTable = ({
  patients,
  checkedIds,
  onCheck,
  onCheckAll,
  userRole,
  isLoading,
}: ViewTypes.PatientsListTableProps) => {
  const { t } = useTranslation('patients');
  const thClass =
    'whitespace-nowrap group-first/head:first:rounded-tl-lg group-first/head:last:rounded-tr-lg bg-dark-grey-100 dark:bg-dark-grey-100 px-6 py-3 text-white font-normal text-sm text-left uppercase';
  const bodyRowClass =
    'text-white whitespace-nowrap font-normal border-y border-y-dark-grey-200 dark:border-y dark:border-y-dark-grey-200 hover:bg-dark-grey-100 dark:hover:bg-dark-grey-100 text-sm';
  const bodyCellClass =
    'group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg px-6 py-7';

  if (isLoading && _.isEmpty(patients)) {
    return (
      <div className="flex h-[385px] w-full items-center justify-center rounded-lg	bg-black/10 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-2 text-sm text-white">
          <Spinner size="sm" className="mt-[-1px]" /> {t('common:loadingWithDots')}
        </div>
      </div>
    );
  }

  if (!isLoading && _.isEmpty(patients)) {
    return (
      <div className="flex h-[385px] w-full items-center justify-center rounded-lg bg-black/10 text-sm	text-sm text-white backdrop-blur-sm">
        No data found
      </div>
    );
  }

  return (
    <div className="scrollbar block w-full overflow-hidden overflow-x-auto">
      <table className={`w-full ${styles.patients__list__table}`}>
        <thead>
          <tr>
            {checkedIds && (
              <th className={thClass}>
                <Checkbox checked={patients.length === checkedIds.length} onChange={onCheckAll} />
              </th>
            )}
            <th className={thClass}>{t('table.patient')}</th>
            <th className={thClass}>{t('table.profileStatus')}</th>
            <th className={thClass}>{t('table.clinic')}</th>
            <th className={thClass}>{t('table.specimenTypes')}</th>
            <th className={thClass}>{t('table.facility')}</th>
            <th className={thClass}>{t('table.onboarding')}</th>
          </tr>
        </thead>
        <tbody className="relative">
          {isLoading && (
            <div className="absolute z-20 flex h-full w-full items-center justify-center rounded-lg	bg-black/10 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-2 text-sm text-white">
                <Spinner size="sm" className="mt-[-1px]" /> Loading...
              </div>
            </div>
          )}
          {!!patients.length &&
            patients.map((p: ViewTypes.Patient, idx: number) => {
              return (
                <tr key={idx} className={bodyRowClass}>
                  {checkedIds && (
                    <td className={bodyCellClass}>
                      <Checkbox checked={checkedIds.includes(`${idx}`)} onChange={() => onCheck?.(`${idx}`)} />
                    </td>
                  )}
                  <td className={bodyCellClass}>
                    <Link
                      href={
                        userRole === 'AccountAdmin'
                          ? buildAccountPatientProfilePageRoute(p.id)
                          : userRole === 'ClinicAdmin'
                          ? buildClinicPatientProfilePageRoute(p.id)
                          : buildAdminGeneralPatientPageRoute(p.id)
                      }>
                      <div className="flex max-w-[205px] items-center gap-2 overflow-hidden overflow-ellipsis whitespace-nowrap">
                        <span className={`${styles.patient__name} sensitive`}>{toPascalCase(p.fullName)}</span>
                      </div>
                    </Link>
                  </td>

                  <td className={bodyCellClass}>
                    <span className="flex items-center gap-2 ">{patientStatus(p.patientStatus)}</span>
                  </td>

                  <td className={bodyCellClass}>
                    {p.clinicId ? (
                      <Link
                        className="hover:underline"
                        href={
                          userRole === 'AccountAdmin'
                            ? `/account/clinics/${p.clinicId}`
                            : userRole === 'ClinicAdmin'
                            ? '/'
                            : `/admin/clinics/${p.clinicId}/general`
                        }>
                        {p.clinicName || 'View Clinic'}
                      </Link>
                    ) : (
                      <div className="flex items-center gap-2 ">
                        <span> {p.clinicName || '-'}</span>
                      </div>
                    )}
                  </td>
                  <td className={bodyCellClass}>
                    <div
                      className="flex items-center gap-2 overflow-hidden whitespace-pre-wrap"
                      style={{ maxHeight: '5rem', position: 'relative' }}>
                      <div className="overflow-hidden overflow-ellipsis">
                        {!!p.specimenTypes ? getSpecimenLabels(p.specimenTypes) : '-'}
                      </div>
                    </div>
                  </td>
                  <td className={bodyCellClass}>
                    {userRole === 'AccountAdmin' || userRole === 'ClinicAdmin' ? (
                      <span className="flex items-center gap-2 ">{p.facilityName || '-'}</span>
                    ) : p.facilityId ? (
                      <Link href={`/admin/facilities/${p.facilityId}`}>
                        <div className="flex items-center gap-2 ">
                          <span className="hover:underline"> {p.facilityName || 'View Facility'}</span>
                        </div>
                      </Link>
                    ) : (
                      <div className="flex items-center gap-2 ">
                        <span> {p.facilityName || '-'}</span>
                      </div>
                    )}
                  </td>
                  <td className={bodyCellClass}>
                    <Badge textColor={PatientOnboardingColor[p.onboardingStatus]}>
                      {PatientOnboardingStatus[p.onboardingStatus]}
                    </Badge>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};
