import PatientComponentLayout from './PatientComponentLayout';
import { ViewTypes } from '@/types';
import DataGridTable, { ColDefType } from '@/components/DataGrid/DataGridTable';
import { formatDataWithTime } from '@/utils/formatDataWithTime';
import { formatDateWithSlashSeparator } from '@/utils/formatDateWithSlashSeparator';

const BillingDateHistory = ({ history }: { history: ViewTypes.BillingStartDateHistoryItem[] }) => {
  const columns: ColDefType[] = [
    {
      headerName: 'Timestamp',
      field: 'timestamp',
      renderCell: row => <span className="text-sm font-normal text-gray-300">{formatDataWithTime(row.timestamp)}</span>,
    },
    { headerName: 'Updated By', field: 'user' },
    {
      headerName: 'Changed from',
      field: 'changeFrom',
      renderCell: row => (!!row?.changeFrom ? formatDateWithSlashSeparator(row?.changeFrom) : '-'),
    },
    {
      headerName: 'Changed to',
      field: 'changeTo',
      renderCell: row => (!!row?.changeTo ? formatDateWithSlashSeparator(row?.changeTo) : '-'),
    },
  ];

  return (
    <PatientComponentLayout col>
      <div className="flex flex-col gap-2">
        <span className="mb-6 text-2xl font-normal text-white">Billing Start Date Updates Log</span>
        {history.length ? <DataGridTable columns={columns} rows={history || []} /> : null}
      </div>
    </PatientComponentLayout>
  );
};

export default BillingDateHistory;
