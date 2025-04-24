import { Spinner, Button } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import DetailsCard from './DetailsCard';
import Link from 'next/link';
import { formatToUSAPhoneFormat, isUserAdmin, isUserGodAdmin } from '@/utils';
import TransportationNotes from '../PatientOverview/components/TransportationNotes';
import classNames from 'classnames';
import { transportationStatuses } from '@/constants/states';
import useTransportationMutation from '@/api/mutations/useTransportationMutation';
import { toast } from 'react-toastify';
import { FaHospital, FaUser, FaVial, FaTruck, FaAddressCard, FaFileInvoiceDollar, FaEye } from 'react-icons/fa';
import { useGetTransportationNotes, useGetTransportationDocuments } from '@/api/queries/transportation.queries';
import { useTableControls } from '@/hooks/useTableControls';
import { PatientAddress } from '@/types/view/PatientOverviewProps.interface';
import useRole from '@/hooks/useRole';
import { buildAdminClinicDetailsPageRoute } from '@/constants/buildRoutes';
import { ShipmentTypes } from '@/constants/patients';
import { formatDateWithSlashSeparator } from '@/utils/formatDateWithSlashSeparator';
import { toPascalCase } from '@/utils/toPascalCase';
import { getSpecimenLabels } from '@/utils/getSpecimenLabels';
import Documents from '../PatientOverview/components/Documents';
import useTranslation from 'next-translate/useTranslation';

type RequestOverviewProps = {
  request: any;
  userRole?: string;
};

const RequestTransportationOverview = ({ request, userRole }: RequestOverviewProps) => {
  const { t } = useTranslation();
  const { firstName, lastName, address, phoneNumber, middleName } = request?.patient;
  const [notes, setNotes] = useState<any>(null);
  const { pagination } = useTableControls(notes, {});

  const { roles } = useRole();
  const isCryoAdmin = isUserAdmin(roles) || isUserGodAdmin(roles);

  const {
    data: transportationNotes,
    isLoading,
    mutate: refetchNotes,
  } = useGetTransportationNotes({
    transportationRequestId: request.id,
    patientId: request.patient.id,
    pageSize: pagination.size,
    pageNumber: pagination.currentPage,
  });

  const { data: transportationDocuments } = useGetTransportationDocuments({
    transportationRequestId: request.id,
    patientId: request.patient.id,
  });

  useEffect(() => {
    if (!isLoading && transportationNotes) {
      setNotes(transportationNotes.items);
    }
  }, [transportationNotes, isLoading]);

  const openTrackUrl = (trackingUrl: string) => {
    if (trackingUrl) {
      window.open(trackingUrl, '_blank');
    } else {
      console.error('Tracking URL is not available.');
    }
  };
  const { updateRequestStatus } = useTransportationMutation();
  const [statuses, setStatuses] = React.useState<string[]>([]);

  const handleChange = async (value: string, id: string) => {
    const statusesUpdated = statuses.includes(value)
      ? statuses.filter((status: string) => status !== value)
      : [...statuses, value];

    const updatedRequest = {
      transportationStatuses: statusesUpdated,
      transportationRequestId: id,
    };
    updateRequestStatus({ ...updatedRequest })
      .then(() => {
        toast.success('Transportation status updated successfully!');
        setStatuses(statusesUpdated);
      })
      .catch(error => {
        toast.error('Error updating transportation  status');
      });
  };
  function formatAddress(address: PatientAddress): string {
    const { street1, street2, city, state, zipCode } = address;
    const parts = [street1, street2, city, state, zipCode].filter(part => !!part);

    return parts.join(', ');
  }

  const getShipmentLabel = (value: string): string => {
    const shipmentType = ShipmentTypes.find(type => type.value === value);
    return shipmentType ? shipmentType.label : 'N/A';
  };

  const patientInfo = [
    {
      name: 'Name',
      value: (
        <Link
          className="sensitive hover:underline"
          href={
            userRole === 'AccountAdmin'
              ? `/account/transportation/${request?.patient?.id}`
              : userRole === 'ClinicAdmin'
              ? `/clinic/transportation/${request?.patient?.id}`
              : `/admin/transportation/${request?.patient?.id}`
          }>
          {toPascalCase(`${firstName || ''} ${middleName || ''} ${lastName || ''}`)}
        </Link>
      ),
    },
    {
      name: 'Address',
      value: address ? formatAddress(address) : '',
    },
    {
      name: 'Phone number',
      value: <div className="sensitive">{formatToUSAPhoneFormat(phoneNumber)}</div>,
    },
  ];

  const witnessInfo = [
    {
      name: 'Name',
      value: request?.witness?.name,
    },
    {
      name: 'Email',
      value: request?.witness?.email,
    },
  ];

  const partnerInfo = [
    {
      name: 'Name',
      value: (
        <Link
          className="sensitive hover:underline"
          href={
            userRole === 'AccountAdmin'
              ? `/account/transportation/${request?.partner?.id}`
              : userRole === 'ClinicAdmin'
              ? `/clinic/transportation/${request?.partner?.id}`
              : `/admin/transportation/${request?.partner?.id}`
          }>
          {toPascalCase(
            `${request?.partner?.firstName || ''} ${request?.partner?.middleName || ''} ${
              request?.partner?.lastName || ''
            }`
          )}
        </Link>
      ),
    },
    {
      name: 'Address',
      value: request?.partner?.address ? formatAddress(request?.partner?.address) : '',
    },
    {
      name: 'Phone number',
      value: <div className="sensitive">{formatToUSAPhoneFormat(request?.partner?.phoneNumber)}</div>,
    },
  ];

  const paymentInfo = [
    {
      name: 'Billed to',
      value: request?.payer,
    },
    {
      name: request?.price?.name || 'Clinic - Clinic Transfer (Local to CryoFuture)',
      value: request?.price?.price || 0,
      styles: { value: 'min-w-[40px] text-end' },
    },
    ...(request?.expeditedDelivery
      ? [
          {
            name: request?.expeditedPrice?.name || 'Clinic - Clinic Transfer (Local) Expedited Delivery Additional Fee',
            value: request?.expeditedPrice?.price || 0,
            styles: { value: 'min-w-[40px] text-end' },
          },
        ]
      : []),
  ];

  const shipmentInfo = [
    {
      name: 'Ticket number',
      value: request?.orderNumber || 'N/A',
    },
    {
      name: 'Shipper number',
      value: request?.transportationDetails.shipperNumber || 'N/A',
    },

    {
      name: 'Number of canes',
      value: request?.numberOfCanes || 'N/A',
    },
    {
      name: 'Number of devices',
      value: request?.numberOfDevices || 'N/A',
    },
    {
      name: 'Specimen type',
      value: getSpecimenLabels(request?.specimenTypes),
    },
  ];

  const specimenInfo = [
    {
      name: 'Account',
      value: request?.account || 'N/A',
    },
    {
      name: 'Facility',
      value: request?.facilityName || 'N/A',
    },
    {
      name: 'Shipment Type',
      value: getShipmentLabel(request?.transportationDetails.shipmentType) || 'N/A',
    },
    {
      name: 'Shipment Sent',
      value: request?.transportationDetails.shipmentSentDate
        ? formatDateWithSlashSeparator(request?.transportationDetails.shipmentSentDate)
        : 'N/A',
    },
    {
      name: 'Shipment Received',
      value: request?.transportationDetails.shipmentReceivedDate
        ? formatDateWithSlashSeparator(request?.transportationDetails.shipmentReceivedDate)
        : 'N/A',
    },
    {
      name: 'Track Shipment',
      value: request?.transportationDetails.trackingUrl ? (
        <Button
          gradientDuoTone="primary"
          size="sm"
          onClick={() => openTrackUrl(request?.transportationDetails.trackingUrl)}>
          Track
        </Button>
      ) : (
        <span>No tracking link</span>
      ),
    },
  ];

  const sendingClinic = [
    {
      name: 'Clinic Name',
      value: request?.sendingClinic?.name || 'N/A',
      link:
        isCryoAdmin && request?.sendingClinic?.id ? buildAdminClinicDetailsPageRoute(request?.sendingClinic?.id) : null,
    },
    {
      name: 'Clinic Address',
      value: request?.sendingClinic?.address ? formatAddress(request?.sendingClinic?.address) : 'N/A',
    },
  ];

  const receivingClinic = [
    {
      name: 'Clinic Name',
      value: request?.receivingClinic?.name || 'N/A',
      link:
        isCryoAdmin && request?.receivingClinic?.id
          ? buildAdminClinicDetailsPageRoute(request?.receivingClinic?.id)
          : null,
    },
    {
      name: 'Clinic Address',
      value: request?.receivingClinic?.address ? formatAddress(request?.receivingClinic?.address) : 'N/A',
    },
  ];

  const receivinglinicContactDetails = [
    {
      name: 'Email',
      value: request?.receivingClinic?.contactDetails?.email || 'N/A',
    },
    {
      name: 'First Name',
      value: request?.receivingClinic?.contactDetails?.firstName || 'N/A',
    },
    {
      name: 'Last Name',
      value: request?.receivingClinic?.contactDetails?.lastName || 'N/A',
    },
    {
      name: 'Phone number',
      value: formatToUSAPhoneFormat(request?.receivingClinic?.contactDetails?.phoneNumber) || 'N/A',
    },
    {
      name: 'Job title',
      value: request?.receivingClinic?.contactDetails?.jobTitle || 'N/A',
    },
  ];

  const sendinglinicContactDetails = [
    {
      name: 'Email',
      value: request?.sendingClinic?.contactDetails?.email || 'N/A',
    },
    {
      name: 'First Name',
      value: request?.sendingClinic?.contactDetails?.firstName || 'N/A',
    },
    {
      name: 'Last Name',
      value: request?.sendingClinic?.contactDetails?.lastName || 'N/A',
    },
    {
      name: 'Phone number',
      value: formatToUSAPhoneFormat(request?.sendingClinic?.contactDetails?.phoneNumber) || 'N/A',
    },
    {
      name: 'Job title',
      value: request?.sendingClinic?.contactDetails?.jobTitle || 'N/A',
    },
  ];

  const requestingClinic = [
    {
      name: 'Clinic Name',
      value: request?.requestingClinic?.name || 'N/A',
      link:
        isCryoAdmin && request?.requestingClinic?.id
          ? buildAdminClinicDetailsPageRoute(request?.requestingClinic?.id)
          : null,
    },
    {
      name: 'Clinic Address',
      value: request?.requestingClinic?.address ? formatAddress(request?.requestingClinic?.address) : 'N/A',
    },
  ];

  const requestingClinicContactDetails = [
    {
      name: 'Email',
      value: request?.requestingClinic?.contactDetails?.email || 'N/A',
    },
    {
      name: 'First Name',
      value: request?.requestingClinic?.contactDetails?.firstName || 'N/A',
    },
    {
      name: 'Last Name',
      value: request?.requestingClinic?.contactDetails?.lastName || 'N/A',
    },
    {
      name: 'Phone number',
      value: formatToUSAPhoneFormat(request?.requestingClinic?.contactDetails?.phoneNumber) || 'N/A',
    },
    {
      name: 'Job title',
      value: request?.requestingClinic?.contactDetails?.jobTitle || 'N/A',
    },
  ];

  useEffect(() => {
    setStatuses(request.transportationStatuses);
  }, [request.transportationStatuses]);

  if (!request) {
    return (
      <div className="absolute z-20 flex h-full w-full items-center justify-center rounded-lg	bg-black/10 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-2 text-sm text-white">
          <Spinner size="sm" className="mt-[-1px]" /> {t('common:loadingWithDots')}
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="text-md mb-4 flex min-w-full max-w-[70px] flex-col items-center gap-3 rounded-md border border-transparent p-4 text-center sm:p-8 md:max-w-full dark:bg-[#1E2021]">
        <ol className="flex w-full flex-col flex-wrap items-start gap-1 space-y-4 border-gray-900 text-gray-500 sm:flex sm:space-x-8 sm:space-y-0 md:flex-row rtl:space-x-reverse">
          {transportationStatuses.map(({ label, value }, index) => (
            <li
              key={index}
              className={classNames('flex items-center space-x-2.5 ', {
                'bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text font-light text-transparent':
                  statuses.includes(value),
              })}>
              <button
                disabled={userRole === 'AccountAdmin'}
                className="font-medium leading-tight"
                onClick={e => handleChange(value, request.id)}>
                <div className="flex gap-2">
                  <span
                    className={classNames('flex h-8 w-8 shrink-0  items-center justify-center rounded-full border-2', {
                      'border-cryo-blue': statuses.includes(value),
                      'border-gray-500': !statuses.includes(value),
                    })}>
                    {statuses.includes(value) && (
                      <svg
                        className={classNames('h-3.5 w-3.5', {
                          'text-cyan-300 ': statuses.includes(value),
                        })}
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 16 12">
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M1 5.917 5.724 10.5 15 1.5"
                        />
                      </svg>
                    )}
                  </span>
                  <span>{label}</span>
                </div>
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div className="mb-4 flex flex-col gap-6 xl:flex-row">
        <div className="flex w-full min-w-[400px] flex-col gap-4 xl:max-w-[490px]">
          <DetailsCard details={patientInfo} title="Patient info" icon={<FaUser />}></DetailsCard>
          {request?.partner ? (
            <DetailsCard details={partnerInfo} title="Partner info" icon={<FaUser />}></DetailsCard>
          ) : null}
          {request?.witness && isCryoAdmin ? (
            <DetailsCard details={witnessInfo} title="Witness Info" icon={<FaEye />}></DetailsCard>
          ) : null}
          <DetailsCard details={shipmentInfo} title="Shipment info" icon={<FaTruck />}></DetailsCard>
        </div>
        <div className="flex flex-col gap-6 xl:w-2/3">
          <DetailsCard details={specimenInfo} title="Specimen info" icon={<FaVial />}></DetailsCard>
          <DetailsCard details={paymentInfo} title="Billing info" icon={<FaFileInvoiceDollar />}></DetailsCard>
          <Documents documents={transportationDocuments || []} />
        </div>
      </div>
      <TransportationNotes
        notes={notes}
        title={'Notes'}
        transportationRequestId={request.id}
        refetchNotes={refetchNotes}
      />
      <div className="row my-4 flex flex-col justify-between gap-6 xl:flex-row">
        <div className="flex w-full flex-col ">
          <DetailsCard details={sendingClinic} title="Sending Clinic" icon={<FaHospital />}></DetailsCard>
          <DetailsCard
            details={sendinglinicContactDetails}
            title="Contact details"
            icon={<FaAddressCard />}></DetailsCard>
        </div>
        <div className="flex w-full flex-col">
          <DetailsCard details={receivingClinic} title="Receiving Clinic" icon={<FaHospital />}></DetailsCard>
          <DetailsCard
            details={receivinglinicContactDetails}
            title="Contact details"
            icon={<FaAddressCard />}></DetailsCard>
        </div>
        <div className="flex w-full flex-col">
          <DetailsCard details={requestingClinic} title="Requesting Clinic" icon={<FaHospital />}></DetailsCard>
          <DetailsCard
            details={requestingClinicContactDetails}
            title="Contact details"
            icon={<FaAddressCard />}></DetailsCard>
        </div>
      </div>
    </div>
  );
};

export default RequestTransportationOverview;
