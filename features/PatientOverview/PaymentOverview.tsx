import { Spinner } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import AvatarInfo from './components/AvatarInfo';
import { isBrowser, isUserPatient } from '@/utils';
import { PatientOverviewProps } from '@/types/view';
import { useGetTransportationNotes, useGetTransportationPatients } from '@/api/queries/transportation.queries';
import { useTableControls } from '@/hooks/useTableControls';
import { toPascalCase } from '@/utils/toPascalCase';
import useRole from '@/hooks/useRole';
import DetailsCard from '../Transportation/DetailsCard';
import PaymentsTable from './PaymentsTable';
import { FaFileInvoiceDollar } from 'react-icons/fa';

const PaymentOverview = ({
  patient,
  refetchPatientInfo,
  isReadonly,
  userRole,
  transportationRequests,
  transportationPagination,
  paymentInfo,
}: PatientOverviewProps & {
  transportationRequests?: any;
  transportationPagination?: any;
  paymentInfo?: any;
}) => {
  const isMediumScreen = isBrowser() && window.innerWidth < 968;

  const [notes, setNotes] = useState<any>(null);
  const [partnersRequests, setPartnersRequests] = useState<any>(null);
  const { pagination } = useTableControls(notes, {});

  const { roles } = useRole();
  const isPatient = isUserPatient(roles);
  const {
    data: transportationNotes,
    isLoading,
    mutate: refetchNotes,
  } = useGetTransportationNotes({
    patientId: !isPatient ? patient.id : '',
    pageSize: pagination.size,
    pageNumber: pagination.currentPage,
  });

  const { pagination: partnersTransRequestsPagination } = useTableControls(partnersRequests, {});

  const { data: partnersTransportationRequestsData } = useGetTransportationPatients({
    pageSize: partnersTransRequestsPagination.size,
    pageNumber: partnersTransRequestsPagination.currentPage,
    patientId: patient?.partner?.id,
  });

  useEffect(() => {
    if (patient?.partner && partnersTransportationRequestsData) {
      setPartnersRequests(partnersTransportationRequestsData);
    }
  }, [partnersTransportationRequestsData, patient]);

  useEffect(() => {
    if (!isLoading && transportationNotes) {
      setNotes(transportationNotes.items);
    }
  }, [transportationNotes, isLoading]);

  if (!patient?.firstName || isLoading) {
    return (
      <div className="absolute z-20 flex h-full w-full items-center justify-center rounded-lg	bg-black/10 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-2 text-sm text-white">
          <Spinner size="sm" className="mt-[-1px]" /> Loading...
        </div>
      </div>
    );
  }
  return isMediumScreen ? (
    <div className="text-center">
      <h4 className="sensitive mb-4 bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-center text-4xl font-light text-transparent">
        {toPascalCase(`${patient.firstName || ''} ${patient.middleName || ''} ${patient.lastName || ''}`)}
      </h4>

      <div className="align-center flex w-full flex-col items-center gap-3">
        <AvatarInfo patient={patient} isPatient={isPatient} />
        <DetailsCard
          icon={<FaFileInvoiceDollar />}
          details={paymentInfo}
          title="Payment details"
          isLoading={isLoading}></DetailsCard>
        <PaymentsTable
          requests={transportationRequests}
          isReadonly={isReadonly}
          pagination={transportationPagination}
          title={'Follow-Up tasks'}
        />
      </div>
    </div>
  ) : (
    <div>
      <div className="mb-6 flex w-full gap-6">
        <div className="flex w-full min-w-[400px] max-w-[490px] flex-col gap-4">
          <AvatarInfo patient={patient} isPatient={isPatient} />
        </div>
        <div className="flex w-2/3 flex-col">
          <DetailsCard
            icon={<FaFileInvoiceDollar />}
            details={paymentInfo}
            title="Payment details"
            isLoading={isLoading}></DetailsCard>
        </div>
      </div>
      <div className="flex gap-6 ">
        <div className="flex w-full flex-col gap-6">
          <PaymentsTable
            requests={transportationRequests}
            isReadonly={isReadonly}
            pagination={transportationPagination}
            title={'Follow-Up tasks'}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentOverview;
