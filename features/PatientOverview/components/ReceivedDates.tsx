import { useGetPatientReceivedDates } from '@/api/queries/patient.queries';
import { useGetAdminReceivedDates } from '@/api/queries/speciment.queries';
import useRole from '@/hooks/useRole';
import { PatientPersonalDetails } from '@/types/view/PatientOverviewProps.interface';
import { isUserAccountAdmin, isUserAdmin, isUserClinicAdmin, isUserGodAdmin, isUserPatient } from '@/utils';
import { formatDateWithSlashSeparator } from '@/utils/formatDateWithSlashSeparator';
import { getSpecimenLabels } from '@/utils/getSpecimenLabels';
import useTranslation from 'next-translate/useTranslation';
import React, { useEffect, useMemo, useState } from 'react';

interface SpecimenData {
  specimenType: string;
  receivedDate: string;
}

const ReceivedDates: React.FC<{ patient: PatientPersonalDetails }> = ({ patient }) => {
  const { roles } = useRole();
  const isPatient = isUserPatient(roles);
  const isCryoAdmin = isUserAdmin(roles) || isUserGodAdmin(roles);
  const isClinicAdmin = isUserClinicAdmin(roles);
  const isNetworkAdmin = isUserAccountAdmin(roles);

  const isAdmin = isCryoAdmin || isClinicAdmin || isNetworkAdmin;

  const { t } = useTranslation('patients');
  const {
    data: adminData,
    error: adminError,
    mutate: refetchAdminData,
  } = useGetAdminReceivedDates(patient?.id, isAdmin);
  const { data: patientData, error: patientError } = useGetPatientReceivedDates(isPatient);

  const [receivedDates, setReceivedDates] = useState<SpecimenData[] | null>(null);

  useEffect(() => {
    if (isPatient && patientData) {
      setReceivedDates(patientData);
    } else if (!isPatient && adminData) {
      setReceivedDates(adminData);
    }
  }, [isPatient, patientData, adminData]);

  useEffect(() => {
    if (isAdmin) {
      refetchAdminData();
    }
  }, [patient]);

  const renderPlaceholder = useMemo(
    () => (
      <div className="mb-4 flex items-center justify-between">
        <div className="my-2 mr-2 w-full rounded-md border border-transparent text-gray-300 dark:bg-[#292B2C]">
          <div className="flex w-full items-center justify-between gap-12 px-4 py-3 text-sm font-normal leading-tight">
            <div>Specimen:</div>
            <div className="flex justify-end text-end">{t('common:notSet')}</div>
          </div>

          <div className="flex w-full items-center justify-between gap-12 px-4 py-3 text-sm font-normal leading-tight">
            {isPatient ? (
              <div>{t(`billing_details_overview.BillingStartDate`)}:</div>
            ) : (
              <div>{t(`billing_details_overview.SpecimenReceivedDate`)}:</div>
            )}
            <div>{t('common:notSet')}</div>
          </div>
        </div>
      </div>
    ),
    [isPatient]
  );

  if (!receivedDates || receivedDates.length === 0 || adminError || patientError) {
    return renderPlaceholder;
  }

  return (
    <div className="my-4 w-full rounded-md dark:bg-[#292B2C]">
      {receivedDates?.map((specimen: SpecimenData, index: number) => (
        <div key={index} className="mb-4 flex items-center justify-between">
          <div className="mr-2 w-full rounded-md border border-transparent text-gray-300">
            <div className="flex w-full items-center justify-between gap-12 px-4 py-2 text-sm font-normal leading-tight">
              <div>{`Specimen ${index + 1}:`}</div>
              <div className="flex justify-end text-end">
                {getSpecimenLabels(specimen?.specimenType) || t('common:notSet')}
              </div>
            </div>

            <div className="flex w-full items-center justify-between gap-12 px-4 py-2 text-sm font-normal leading-tight">
              {isPatient ? (
                <div>{t(`billing_details_overview.BillingStartDate`)}:</div>
              ) : (
                <div>{t(`billing_details_overview.SpecimenReceivedDate`)}:</div>
              )}
              <div>
                {specimen?.receivedDate ? formatDateWithSlashSeparator(specimen?.receivedDate) : t('common:notSet')}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReceivedDates;
