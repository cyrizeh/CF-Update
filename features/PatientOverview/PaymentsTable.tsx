import PatientComponentLayout from '@/features/PatientOverview/components/PatientComponentLayout';
import { formatDataWithTime } from '@/utils/formatDataWithTime';
import DataGridTable, { ColDefType } from '@/components/DataGrid/DataGridTable';
import Pagination from '@/components/Pagination/Pagination';

const PaymentsTable = ({
  requests,
  isReadonly,
  onActionClick,
  pagination,
  title = 'Transportation Requests',
}: {
  requests: any;
  isReadonly?: boolean;
  onActionClick?: any;
  pagination?: any;
  title?: string;
}) => {
  const columns: Array<ColDefType & { show: boolean }> = [
    {
      headerName: 'Creation date',
      field: 'creationDate',
      renderCell: (row: any) => formatDataWithTime(row?.creationDate),
      show: true,
    },
    {
      headerName: 'Action Type',
      field: 'actionType',
      show: true,
    },
    {
      headerName: 'Action Result',
      field: 'actionResult',
      show: true,
    },
    {
      headerName: 'responsible',
      field: 'responsible',
      show: true,
    },
    {
      headerName: 'Note',
      field: 'note',
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

      {!!requests?.length && (
        <div className="rounded-md bg-dark-grey-100 p-4 md:p-8">
          <DataGridTable rows={requests || []} columns={columns} />
        </div>
      )}

      {!!requests?.items?.length && pagination ? (
        <div className="flex justify-center pb-8">
          <Pagination {...pagination} />
        </div>
      ) : null}
    </PatientComponentLayout>
  );
};

export default PaymentsTable;
