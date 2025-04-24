import { useGetPatientInfo, useGetPatientTransportations } from '@/api/queries/patient.queries';

import PatientTransportationOverview from '@/features/PatientOverview/PatientTransportationOverview';
import { useTableControls } from '@/hooks/useTableControls';
import { toPascalCase } from '@/utils/toPascalCase';
import { useEffect, useState } from 'react';

function OverviewPatientPage() {
  const { data: patient } = useGetPatientInfo();

  const [transportationRequests, setTransportationRequests] = useState<any>(null);
  const { pagination } = useTableControls(transportationRequests, {});
  const { data: transportationRequestsData, isLoading } = useGetPatientTransportations({
    pageSize: pagination.size,
    pageNumber: pagination.currentPage,
  });

  useEffect(() => {
    if (!isLoading && transportationRequestsData) {
      setTransportationRequests(transportationRequestsData);
    }
  }, [transportationRequestsData, isLoading]);

  return (
    <div>
      <div className="flex justify-between sm:mb-10">
        <h1 className="sensitive w-auto bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-4xl font-light leading-[60px] text-transparent lg:text-5xl ">
          {toPascalCase(`${patient?.firstName || ''} ${patient?.lastName || ''}`)}
        </h1>
      </div>
      {patient && (
        <PatientTransportationOverview
          patient={patient}
          transportationRequests={transportationRequests}
          isReadonly={true}
        />
      )}
    </div>
  );
}

export default OverviewPatientPage;
