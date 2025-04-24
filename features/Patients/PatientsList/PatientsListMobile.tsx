import { HiChevronDown, HiChevronLeft } from 'react-icons/hi';
import { ReactNode, useState } from 'react';
import { Button } from 'flowbite-react';
import { Badge } from '@/components/Badge/Badge';
import useTranslation from 'next-translate/useTranslation';
import { ViewTypes } from '@/types';
import Link from 'next/link';
import { PatientOnboardingColor, PatientOnboardingStatus } from '../../../types/Patients.enum';
import {
  buildAccountPatientProfilePageRoute,
  buildAdminGeneralPatientPageRoute,
  buildClinicPatientProfilePageRoute,
} from '@/constants/buildRoutes';
import { toPascalCase } from '@/utils/toPascalCase';
import { getSpecimenLabels } from '@/utils/getSpecimenLabels';

const PatientInfoItem = ({ header, value, isLast = false }: { header: string; value: ReactNode; isLast?: boolean }) => {
  const mainClasses = `grid grid-cols-2 mb-2.5 ${isLast ? '' : 'border-b border-dark-grey-300'}`;
  return (
    <div className={mainClasses}>
      <div className="pts__item__title py-1 pl-4 text-sm font-semibold uppercase text-gray-400">{header}</div>
      <div className="pts__item__value text-medium py-1 pl-4">{value}</div>
    </div>
  );
};

export const PatientsListMobile = ({ patients, userRole }: { patients: ViewTypes.Patient[]; userRole?: string }) => {
  const { t } = useTranslation('patients');
  const [openedId, setOpenedId] = useState<string>('');

  const handlePatientOpen = (id: string) => {
    if (openedId === id) {
      setOpenedId('');
      return;
    }
    setOpenedId(id);
  };

  const itemIsOpened = (id: string) => openedId === id;

  return (
    <div>
      {!!patients.length &&
        patients.map((p: ViewTypes.Patient, idx: number) => {
          return (
            <div key={idx} className="border-b border-dark-grey-300 text-sm font-normal">
              <div className="flex flex-row items-center justify-between py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="... sensitive max-w-[136px] truncate text-white hover:cursor-pointer hover:underline">
                    {toPascalCase(p.fullName)}
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <Badge textColor={PatientOnboardingColor[p.onboardingStatus]}>
                    {PatientOnboardingStatus[p.onboardingStatus]}
                  </Badge>

                  <span className="cursor-pointer text-white">
                    {itemIsOpened(`${idx}`) && <HiChevronDown size={20} onClick={() => handlePatientOpen(`${idx}`)} />}
                    {!itemIsOpened(`${idx}`) && <HiChevronLeft size={20} onClick={() => handlePatientOpen(`${idx}`)} />}
                  </span>
                </div>
              </div>

              {itemIsOpened(`${idx}`) && (
                <div>
                  <div className="text-white">
                    {p.specimen && (
                      <PatientInfoItem
                        header={t('table.specimen')}
                        value={<Badge textColor={'primary'}>{p.specimen}</Badge>}
                      />
                    )}
                    {p.clinicName && (
                      <Link
                        href={
                          userRole === 'AccountAdmin'
                            ? `account/clinics/${p.clinicId}`
                            : userRole === 'ClinicAdmin'
                            ? `/`
                            : `/admin/clinics/${p.clinicId}/general`
                        }>
                        <PatientInfoItem header={t('table.clinic')} value={p.clinicName} />
                      </Link>
                    )}
                    {p.specimenTypes && (
                      <Link
                        href={
                          userRole === 'AccountAdmin'
                            ? `account/clinics/${p.clinicId}`
                            : userRole === 'ClinicAdmin'
                            ? `/`
                            : `/admin/clinics/${p.clinicId}/general`
                        }>
                        <PatientInfoItem header={t('table.specimenTypes')} value={getSpecimenLabels(p.specimenTypes)} />
                      </Link>
                    )}
                    {p.facilityName &&
                      (userRole === 'AccountAdmin' || userRole === 'ClinicAdmin' ? (
                        <span>
                          <PatientInfoItem header={t('table.facility')} value={p.facilityName} />
                        </span>
                      ) : (
                        <Link href={`/admin/facilities/${p.facilityId}`}>
                          <PatientInfoItem header={t('table.facility')} value={p.facilityName} />
                        </Link>
                      ))}
                    {p.paymentType && (
                      <PatientInfoItem
                        isLast={true}
                        header={t('table.payment')}
                        value={<Badge textColor="primary">{p.paymentType}</Badge>}
                      />
                    )}
                  </div>
                  <div>
                    <Button size={'sm'} className={'mb-4 w-full'} color={'grayBorderedDefault'}>
                      <Link
                        href={
                          userRole === 'AccountAdmin'
                            ? buildAccountPatientProfilePageRoute(p.id)
                            : userRole === 'ClinicAdmin'
                            ? buildClinicPatientProfilePageRoute(p.id)
                            : buildAdminGeneralPatientPageRoute(p.id)
                        }>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
};
