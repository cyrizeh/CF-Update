import { useGetPatientCanes } from '@/api/queries/speciment.queries';
import DataGridTable from '@/components/DataGrid/DataGridTable';
import Pagination from '@/components/Pagination/Pagination';
import { locationStatuses } from '@/constants/specimens';
import { useTableControls } from '@/hooks/useTableControls';
import { joinValues } from '@/utils/joinValues';
import { Chip } from '@mui/material';
import _ from 'lodash';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';
import { Badge } from 'flowbite-react';
import { getSpecimenLabels } from '@/utils/getSpecimenLabels';

const PatientCanes = () => {
  const { t } = useTranslation('patients');
  const [canesList, setCanesList] = useState<any>(null);
  const { pagination } = useTableControls(canesList, {});

  const { data: canesData, isLoading } = useGetPatientCanes({
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
      headerName: 'Location Status',
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
      headerName: t('table.specimen'),
      field: 'tissueType',
      renderCell: (row: { specimenTypes: any[] }) =>
        row.specimenTypes?.length ? getSpecimenLabels(row.specimenTypes) : '-',
      wrapText: true,
    },
    {
      headerName: t('canes.tank'),
      field: 'tank',
      renderCell: (row: any) => row?.tank || '-',
    },
    {
      headerName: t('canes.vault'),
      field: 'vault',
      renderCell: (row: any) => row?.vault || `-`,
    },
    {
      headerName: `${t('canes.numberOf')} \n ${t('canes.strawVials')}`,
      field: 'numberOfDevices',
      renderHeader: () => (
        <p className="text-center">
          {t('numberOfDevices.1stPart')} <br /> {t('numberOfDevices.2ndPart')}
        </p>
      ),
      align: 'center',
    },
    {
      headerName: 'Tank integrity',
      field: 'integrity',
      renderCell: (row: any) =>
        row?.tank ? (
          <Badge color={'green'} className="item-center flex h-[40px] w-[44px] justify-center  text-center">
            OK
          </Badge>
        ) : (
          '-'
        ),
      align: 'center',
    },
    {
      headerName: 'Temperature',
      field: 'temperature',
      renderCell: (row: any) =>
        row?.tank ? (
          <Badge color={'green'} className="item-center flex h-[40px] w-[44px] justify-center  text-center">
            OK
          </Badge>
        ) : (
          '-'
        ),
      align: 'center',
    },
    {
      headerName: 'Weight',
      field: 'weight',
      renderHeader: () => (
        <p className="text-center">
          {'Liquid nitrogen'} <br /> {'weight'}
        </p>
      ),
      renderCell: (row: any) =>
        row?.tank ? (
          <Badge color={'green'} className="item-center flex h-[40px] w-[44px] justify-center  text-center">
            OK
          </Badge>
        ) : (
          '-'
        ),
      align: 'center',
    },
  ].filter(Boolean);

  useEffect(() => {
    if (!isLoading && canesData) {
      setCanesList(canesData);
    }
  }, [canesData, isLoading]);
  return (
    <div className="mb-4 rounded-md bg-dark-grey-400 p-4 md:p-8">
      <DataGridTable columns={columns} rows={canesList?.items || []} isLoading={isLoading} />
      {!_.isEmpty(canesList?.items) ? (
        <div className="flex pt-8">
          <Pagination {...pagination} />
        </div>
      ) : null}
    </div>
  );
};

export default PatientCanes;
