import { Dropdown, Spinner } from 'flowbite-react';
import React, { useCallback, useEffect, useState } from 'react';
import AvatarInfo from './components/AvatarInfo';
import PersonalDetails from './components/PersonalDetails';
import { hasPermission, isBrowser, isUserPatient } from '@/utils';
import { PatientOverviewProps } from '@/types/view';
import Notes from './components/Notes';
import Attachments from './components/Attachments/Attachments';
import PatientRequests from '../Patients/TransportationRequest/PatientRequests';
import ExtendedPatientRequests from '../Patients/TransportationRequest/ExtendedPatientRequests';
import TransportationNotes from './components/TransportationNotes';
import { useGetTransportationNotes, useGetTransportationPatients } from '@/api/queries/transportation.queries';
import { useTableControls } from '@/hooks/useTableControls';
import PatientRequestsTable from '../Patients/TransportationRequest/PatientRequestsTable';
import { toPascalCase } from '@/utils/toPascalCase';
import useRole from '@/hooks/useRole';
import { usePermissions } from '@/contexts/PermissionsContext/PermissionsContext';
import { toast } from 'react-toastify';
import { FaCopy } from 'react-icons/fa';
import Image from 'next/image';
import dots from '@/public/icons/dots-vertical.svg';
import useTranslation from 'next-translate/useTranslation';

const PatientTransportationOverview = ({
  patient,
  refetchPatientInfo,
  isReadonly,
  userRole,
  transportationRequests,
  transportationPagination,
}: PatientOverviewProps & {
  transportationRequests?: any;
  transportationPagination?: any;
}) => {
  const { t } = useTranslation('patients');

  const [notes, setNotes] = useState<any>(null);
  const [partnersRequests, setPartnersRequests] = useState<any>(null);
  const { pagination } = useTableControls(notes, {});
  const { userPermissions } = usePermissions();
  const isUserCanReadAttachments = hasPermission(userPermissions, 'read:attachments');
  const isUserCanReadNotes =
    hasPermission(userPermissions, 'read:notes') || hasPermission(userPermissions, 'create:notes');
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

  const copyUserId = () => {
    if (!patient?.userId) {
      toast.error('User ID not available');
      return;
    }
    navigator.clipboard.writeText(patient?.userId as string);
    toast.success('User ID copied to clipboard');
  };

  if (!patient?.firstName || isLoading) {
    return (
      <div className="absolute z-20 flex h-full w-full items-center justify-center rounded-lg	bg-black/10 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-2 text-sm text-white">
          <Spinner size="sm" className="mt-[-1px]" /> Loading...
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className="mb-6 flex w-full flex-col gap-6 lg:flex-row">
        <div className="flex w-full flex-col gap-4 lg:min-w-[400px] lg:max-w-[490px]">
          <div className="min-w-full rounded-md border border-transparent lg:max-w-[370px] dark:bg-[#1E2021]">
            <div className="flex flex-wrap justify-end pt-5">
              {userRole === 'Admin' && (
                <Dropdown
                  placement="bottom-end"
                  label=""
                  dismissOnClick={true}
                  renderTrigger={() => (
                    <div className="mx-5 flex gap-1 hover:cursor-pointer">
                      <span className="text-base text-white">{t('common:actions')}</span>
                      <Image src={dots} alt="actions" />
                    </div>
                  )}>
                  <div className="rounded-lg  bg-[#4F4F4F] p-[1px]">
                    <Dropdown.Item className="hover:cursor-pointer" onClick={copyUserId}>
                      <FaCopy />
                      <p className="mx-2">{'Copy User ID'}</p>
                    </Dropdown.Item>
                  </div>
                </Dropdown>
              )}
            </div>
            <AvatarInfo patient={patient} refetchPatientInfo={refetchPatientInfo} />
          </div>
        </div>
        <div className="flex flex-col lg:w-2/3">
          <PersonalDetails patient={patient} refetchPatientInfo={refetchPatientInfo} isReadonly={isReadonly} />
        </div>
      </div>
      <div className="flex gap-6 ">
        <div className="flex w-full flex-col gap-6">
          {userRole === 'Admin' ? (
            <ExtendedPatientRequests />
          ) : userRole === 'AccountAdmin' ? (
            <PatientRequests isReadonly={isReadonly} />
          ) : (
            <PatientRequestsTable
              transportationRequests={transportationRequests}
              isReadonly={isReadonly}
              transportationPagination={transportationPagination}
            />
          )}
          {partnersRequests?.items?.length > 0 ? (
            <PatientRequestsTable
              transportationRequests={partnersRequests}
              transportationPagination={partnersTransRequestsPagination}
              isReadonly={isReadonly}
              title="Partner's Transportation Requests"
            />
          ) : null}
          {!isReadonly ? (
            <>
              <TransportationNotes notes={notes} title={'Transportation Notes'} refetchNotes={refetchNotes} />
              {isUserCanReadNotes && <Notes patient={patient} />}
              {isUserCanReadAttachments && <Attachments patient={patient} />}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default PatientTransportationOverview;
