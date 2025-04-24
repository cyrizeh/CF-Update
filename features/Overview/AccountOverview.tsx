import useTranslation from 'next-translate/useTranslation';
import { Badge } from 'flowbite-react';
import { useRouter } from 'next/router';
import { ViewTypes } from '@/types';
import { Spinner } from 'flowbite-react';
import Clinic from '../Clinics/ClinicsList/Clinic';
import { PatientsListTable } from '../Patients/PatientsList/PatientsListTable';
import { PatientsListMobile } from '../Patients/PatientsList/PatientsListMobile';

import { useScreenWidth } from '@/hooks';

import { useGetClinicsByAccountId, useGetPatientsByAccountId, useGetAccountById } from '@/api/queries/account.queries';
import { useGetUsers } from '@/api/queries/user.queries';

const AccountOverview = () => {
  const router = useRouter();
  const { data: usersData } = useGetUsers();

  const { t } = useTranslation('overview');
  const { isSmallScreen } = useScreenWidth();

  const { data: account } = useGetAccountById(usersData?.accountId as string);
  const { data: clinics, mutate } = useGetClinicsByAccountId({ id: usersData?.accountId, pageSize: 4 });
  const { data: patients } = useGetPatientsByAccountId({
    id: usersData?.accountId,
    pageSize: 6,
    filters: { PatientType: 'Storage' },
  });

  const handleViewClinics = () => {
    router.push(`/account/clinics`);
  };

  const handleViewPatients = () => {
    router.push(`/account/patients`);
  };

  return (
    <>
      <div className="mb-12 flex flex-col gap-4 text-[40px] font-light leading-[60px] md:flex-row md:items-center">
        <p className="bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-5xl text-transparent md:h-14 ">
          {account?.name}
        </p>
      </div>
      <div className="mb-6 flex w-full items-center justify-between">
        <div className="flex items-center">
          <p className="mr-3 text-2xl font-normal dark:text-white">{t('common:entity.clinics')}</p>

          {clinics?.totalCount ? (
            <Badge color="cryo" className="px-3">
              {clinics?.totalCount}
            </Badge>
          ) : null}
        </div>

        <p
          className="p-2 text-base font-light font-light text-white transition hover:cursor-pointer hover:underline dark:text-gray-400 dark:hover:text-white"
          onClick={handleViewClinics}>
          {t('viewAllClinics')}
        </p>
      </div>

      <div className="relative mb-14 grid grid-flow-row grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
        {clinics?.items.length ? (
          clinics?.items.map((clinic: ViewTypes.Clinic, index: number) => {
            return <Clinic key={index} clinic={clinic} updateClinics={mutate} userRole={usersData?.role} />;
          })
        ) : (
          <div className="flex items-center justify-center gap-2 text-sm text-white">
            <Spinner size="sm" className="mt-[-1px] text-center" /> Loading...
          </div>
        )}
      </div>

      <div className="mb-6 flex w-full items-center justify-between">
        <div className="flex items-center">
          <p className="mr-3 text-2xl font-normal dark:text-white">{t('common:entity.patients')}</p>

          {patients?.totalCount ? (
            <Badge color="cryo" className="px-3">
              {patients?.totalCount}
            </Badge>
          ) : null}
        </div>

        <p
          className="p-2 text-base font-light font-light text-white transition hover:cursor-pointer hover:underline dark:text-gray-400 dark:hover:text-white"
          onClick={handleViewPatients}>
          {t('viewAllPatients')}
        </p>
      </div>
      <div className="mb-4 rounded-md bg-dark-grey-400 p-4 md:p-8">
        {!isSmallScreen && <PatientsListTable patients={patients?.items || []} userRole={usersData?.role} />}
        {isSmallScreen && <PatientsListMobile patients={patients?.items || []} userRole={usersData?.role} />}
      </div>
    </>
  );
};

export default AccountOverview;
