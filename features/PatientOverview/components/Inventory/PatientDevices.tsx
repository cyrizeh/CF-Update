import { useGetPatientDevices } from '@/api/queries/speciment.queries';
import DataGridTable from '@/components/DataGrid/DataGridTable';
import Pagination from '@/components/Pagination/Pagination';
import { locationStatuses } from '@/constants/specimens';
import { useTableControls } from '@/hooks/useTableControls';
import { Chip } from '@mui/material';
import _ from 'lodash';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';
import { getSpecimenLabels } from '@/utils/getSpecimenLabels';

const PatientDevices = () => {
  const { t } = useTranslation('patients');
  const [devicesList, setDevicesList] = useState<any>(null);
  const { pagination } = useTableControls(devicesList, {});

  const { data: devicesData, isLoading } = useGetPatientDevices({
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
          <p className='text-center px-2 w-10'>{'-'}</p>
        ),
    },
    {
      headerName: t('table.locationStatus'),
      field: 'locationStatus',
      renderCell: (row: { locationStatus: any }) => (
        <p>{locationStatuses.find((item: any) => item.value === row.locationStatus)?.label}</p>
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
      headerName: `${t('numberOfSpecimens.1stPart')}`,
      field: 'numberOfSpecimens',
      renderHeader: () => (
        <p className="text-center">
          {t('numberOfSpecimens.1stPart')} <br /> {t('numberOfSpecimens.2ndPart')}
        </p>
      ),
    },
  ].filter(Boolean);

  useEffect(() => {
    if (!isLoading && devicesData) {
      setDevicesList(devicesData);
    }
  }, [devicesData, isLoading]);

  return (
    <div className="mb-4 rounded-md bg-dark-grey-400 p-4 md:p-8">
      <DataGridTable columns={columns} rows={devicesList?.items || []} isLoading={isLoading} />
      {!_.isEmpty(devicesList?.items) ? (
        <div className="flex pt-8">
          <Pagination {...pagination} />
        </div>
      ) : null}
    </div>
  );
};

export default PatientDevices;
