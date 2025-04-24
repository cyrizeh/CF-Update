import { useGetPatientSpecimens } from '@/api/queries/speciment.queries';
import DataGridTable from '@/components/DataGrid/DataGridTable';
import Pagination from '@/components/Pagination/Pagination';
import { useTableControls } from '@/hooks/useTableControls';
import { getSpecimenLabels } from '@/utils/getSpecimenLabels';
import { Chip } from '@mui/material';
import _ from 'lodash';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';

const PatientSpecimens = () => {
  const { t } = useTranslation('patients');
  const [specimensList, setSpecimensList] = useState<any>(null);
  const { pagination } = useTableControls(specimensList, {});

  const { data: canesData, isLoading } = useGetPatientSpecimens({
    params: {
      pageSize: pagination.size,
      pageNumber: pagination.currentPage,
    },
  });

  const columns = [
    {
      headerName: t('canes.rfid'),
      field: 'rfid',
      renderCell: (item: { id: string; rfid: string }) =>
        item?.rfid ? (
          <Chip
            label={item?.rfid}
            size="small"
            sx={{
              color: 'white',
              backgroundColor: '#292A2C',
              borderRadius: '6px',
              fontSize: '12px',
            }}
          />
        ) : (
          <p className="w-10 px-2 text-center">{'-'}</p>
        ),
    },
    {
      headerName: t('canes.facility'),
      field: 'facilityName',
      wrapText: true,
    },
    {
      headerName: t('canes.clinic'),
      field: 'clinicName',
      wrapText: true,
    },
    {
      headerName: t('specimenType'),
      field: 'specimenType',
      renderCell: (row: any) => (row?.specimenType ? getSpecimenLabels(row.specimenType) : '-'),
    },
    {
      headerName: t('canes.strawPTGRezults'),
      field: 'pgtResults',
    },
  ].filter(Boolean);

  useEffect(() => {
    if (!isLoading && canesData) {
      setSpecimensList(canesData);
    }
  }, [canesData, isLoading]);

  return (
    <div className="mb-4 rounded-md bg-dark-grey-400 p-4 md:p-8">
      <DataGridTable columns={columns} rows={specimensList?.items || []} isLoading={isLoading} />
      {!_.isEmpty(specimensList?.items) ? (
        <div className="flex pt-8">
          <Pagination {...pagination} />
        </div>
      ) : null}
    </div>
  );
};

export default PatientSpecimens;
