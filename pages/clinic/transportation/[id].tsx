import { useGetClinicsTransportationRequests } from '@/api/queries/clinic.queries';
import { useGetPatientsById } from '@/api/queries/patient.queries';
import { useGetUsers } from '@/api/queries/user.queries';
import PatientTransportationOverview from '@/features/PatientOverview/PatientTransportationOverview';
import { useTableControls } from '@/hooks/useTableControls';
import { toPascalCase } from '@/utils/toPascalCase';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function OverviewPage() {
  const router = useRouter();

  const [transportationRequests, setTransportationRequests] = useState<any>(null);
  const { pagination } = useTableControls(transportationRequests, {});
  const { data: patient } = useGetPatientsById(router?.query?.id as string);
  const { data: usersData } = useGetUsers();
  const { data: transportationRequestsData, isLoading } = useGetClinicsTransportationRequests({
    id: usersData?.clinicId && patient?.id ? usersData?.clinicId : '',
    filters: {
      PatientId: patient?.id || '',
    },
    pageSize: pagination.size,
    pageNumber: pagination.currentPage,
  });

  useEffect(() => {
    if (!isLoading && transportationRequestsData) {
      setTransportationRequests(transportationRequestsData);
    }
  }, [transportationRequestsData, isLoading]);

  return (
    <>
      <div className="flex items-end justify-between sm:mb-10">
        <h1 className="sensitive w-auto bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-4xl font-light leading-[60px] text-transparent lg:text-5xl ">
          {toPascalCase(`${patient?.firstName || ''} ${patient?.middleName || ''} ${patient?.lastName || ''}`)}
        </h1>
      </div>
      {patient && (
        <PatientTransportationOverview
          patient={patient}
          isReadonly={true}
          transportationRequests={transportationRequests}
          transportationPagination={pagination}
        />
      )}
    </>
  );
}
