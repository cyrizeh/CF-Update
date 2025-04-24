import { Button } from 'flowbite-react';
import PatientComponentLayout from '@/features/PatientOverview/components/PatientComponentLayout';
import { formatDataWithTime } from '@/utils/formatDataWithTime';
import { transportationStatuses } from '@/constants/states';
import PencilAlt from '@/public/icons/PencilAlt';
import DataGridTable, { ColDefType } from '@/components/DataGrid/DataGridTable';
import Pagination from '@/components/Pagination/Pagination';

const PatientRequestsTable = ({
  transportationRequests,
  isReadonly,
  onActionClick,
  transportationPagination,
  title = 'Transportation Requests',
}: {
  transportationRequests: any;
  isReadonly?: boolean;
  onActionClick?: any;
  transportationPagination?: any;
  title?: string;
}) => {
  const openTrackUrl = (trackingUrl: string) => {
    if (trackingUrl) {
      window.open(trackingUrl, '_blank');
    } else {
      console.error('Tracking URL is not available.');
    }
  };

  const columns: Array<ColDefType & { show: boolean }> = [
    {
      headerName: 'Order number',
      field: 'orderNumber',
      renderCell: (row: any) => <span>{row.orderNumber || '-'}</span>,
      show: true,
    },
    {
      headerName: 'Transportation Status',
      field: 'transportationStatuses',
      renderCell: (row: any) =>
        row.transportationStatuses
          ?.map((value: string) => transportationStatuses.find((status: any) => status.value === value)?.label)
          .join(', ') || '-',
      minWidth: 220,
      show: true,
      wrapText: true,
    },
    {
      headerName: 'Creation date',
      field: 'created',
      renderCell: (row: any) => formatDataWithTime(row?.created),
      show: true,
    },
    {
      headerName: 'Sending Clinic',
      field: 'sendingClinicName',
      renderCell: (row: any) => row?.sendingClinicName || '-',
      show: true,
      wrapText: true,
    },
    {
      headerName: 'Receiving Clinic',
      field: 'receivingClinicName',
      renderCell: (row: any) => row?.receivingClinicName || '-',
      show: true,
      wrapText: true,
    },
    {
      headerName: 'Billed to',
      field: 'payer',
      renderCell: (row: any) => row?.payer || '-',
      show: true,
    },
    {
      headerName: 'Billing status',
      field: 'paymentStatus',
      renderCell: (row: any) => row?.paymentStatus || '-',
      show: true,
    },
    {
      headerName: 'Track shipment',
      field: 'trackingUrl',
      renderCell: (row: any) =>
        row?.trackingUrl ? (
          <Button gradientDuoTone="primary" size="sm" onClick={() => openTrackUrl(row?.trackingUrl)}>
            Track
          </Button>
        ) : (
          <span>No tracking link</span>
        ),
      show: true,
    },
    // {
    //   headerName: 'Action',
    //   field: 'action',
    //   renderCell: (row: any) => (
    //     <Button
    //       className="border-0 p-1 lg:block"
    //       size={'xs'}
    //       gradientDuoTone="transparent"
    //       onClick={() => onActionClick(row)}>
    //       <PencilAlt />
    //     </Button>
    //   ),
    //   show: !isReadonly,
    // },
  ].filter(filter => filter.show);

  return (
    <PatientComponentLayout col>
      <div className="mb-6 flex items-start">
        <span className="text-2xl font-normal text-white">{title}</span>
      </div>

      {!!transportationRequests?.items?.length && (
        <div className="rounded-md bg-dark-grey-100 p-4 md:p-8">
          <DataGridTable rows={transportationRequests?.items || []} columns={columns} />
        </div>
      )}

      {!!transportationRequests?.items?.length && transportationPagination ? (
        <div className="flex justify-center pb-8">
          <Pagination {...transportationPagination} />
        </div>
      ) : null}
    </PatientComponentLayout>
  );
};

export default PatientRequestsTable;
