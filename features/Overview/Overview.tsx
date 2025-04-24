import useTranslation from 'next-translate/useTranslation';
import { Badge, Spinner } from 'flowbite-react';
import { useRouter } from 'next/router';

import Clinic from '../Clinics/ClinicsList/Clinic';
import { PatientsListTable } from '../Patients/PatientsList/PatientsListTable';
import { PatientsListMobile } from '../Patients/PatientsList/PatientsListMobile';

import { useScreenWidth } from '@/hooks';

import { useGetClinics } from '@/api/queries/clinic.queries';
import { useGetPatients } from '@/api/queries/patient.queries';
import { useGetUsers } from '@/api/queries/user.queries';

const Overview = () => {
  const router = useRouter();
  const { t } = useTranslation('overview');
  const { isSmallScreen } = useScreenWidth();
  
  const { data: usersData, error: usersError } = useGetUsers();
  const { data: patients, error: patientsError } = useGetPatients({ pageSize: 6, filters: { PatientType: 'Storage' } });
  const { data: clinics, mutate, error: clinicsError } = useGetClinics({ pageSize: 4 });

  const handleViewClinics = () => {
    router.push(`/admin/clinics`);
  };

  const handleViewPatients = () => {
    router.push(`/admin/patients`);
  };

  if (usersError || patientsError || clinicsError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-xl text-red-500 mb-4">Error loading data</p>
        <p className="text-gray-600">Please try refreshing the page</p>
      </div>
    );
  }

  if (!usersData || !patients || !clinics) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="mb-4 h-14 w-56 bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-5xl font-light text-transparent">
        {t('title')}
      </h1>
      
      <div className="mb-6 flex w-full items-center justify-between">
        <div className="flex items-center">
          <p className="mr-3 text-2xl font-normal text-gray-900 dark:text-white">{t('common:entity.clinics')}</p>
          {clinics?.totalCount ? (
            <Badge color="info" className="px-3">
              {clinics?.totalCount}
            </Badge>
          ) : null}
        </div>

        <p
          className="p-2 text-base font-light text-gray-600 hover:text-gray-900 transition hover:cursor-pointer hover:underline dark:text-gray-400 dark:hover:text-white"
          onClick={handleViewClinics}>
          {t('viewAllClinics')}
        </p>
      </div>

      <div className="relative mb-14 grid grid-flow-row grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
        {clinics?.items?.length > 0 ? (
          clinics.items.map((clinic, index) => (
            <Clinic key={index} clinic={clinic} updateClinics={mutate} userRole={usersData?.role} />
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center py-4">No clinics found</p>
        )}
      </div>

      <div className="mb-6 flex w-full items-center justify-between">
        <div className="flex items-center">
          <p className="mr-3 text-2xl font-normal text-gray-900 dark:text-white">{t('common:entity.patients')}</p>
          {patients?.totalCount ? (
            <Badge color="info" className="px-3">
              {patients?.totalCount}
            </Badge>
          ) : null}
        </div>

        <p
          className="p-2 text-base font-light text-gray-600 hover:text-gray-900 transition hover:cursor-pointer hover:underline dark:text-gray-400 dark:hover:text-white"
          onClick={handleViewPatients}>
          {t('viewAllPatients')}
        </p>
      </div>

      <div className="mb-4 rounded-md bg-white dark:bg-dark-grey-400 p-4 md:p-8 shadow-sm">
        {patients?.items?.length > 0 ? (
          <>
            {!isSmallScreen && <PatientsListTable patients={patients.items} />}
            {isSmallScreen && <PatientsListMobile patients={patients.items} />}
          </>
        ) : (
          <p className="text-gray-500 text-center py-4">No patients found</p>
        )}
      </div>
    </div>
  );
};

export default Overview;
