import { TableLink } from '@/components/DataGrid/TableComponents';
import {
  buildAdminClinicDetailsPageRoute,
  buildAdminFacilityDetailsPageRoute,
  buildAdminGeneralPatientPageRoute,
} from '@/constants/buildRoutes';
import { formatDateWithSlashSeparator } from '@/utils/formatDateWithSlashSeparator';
import { FaPlus } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { toast } from 'react-toastify';
import { Dropdown } from 'flowbite-react';
import dots from '@/public/icons/dots-vertical.svg';
import Image from 'next/image';
import PencilAlt from '@/public/icons/PencilAlt';
import { toPascalCase } from '@/utils/toPascalCase';
import { LocationStatusTitle } from '@/constants/specimens';
import { conditionComponent } from '@/utils/conditionComponent';
import { getSpecimenLabels } from '@/utils/getSpecimenLabels';
interface DeviceColumnsProps {
  openModalToEditDevice: (row: any) => void;
  onOpenModalToDeleteDevice: (id: any) => void;
  t: (key: string) => string;
  isCryoAdmin: boolean;
  isClinicAdmin: boolean;
  openModalToAddSpecimenToStraw: (row: any) => void;
}

interface SpecimensColumnsProps {
  onOpenModalToDeleteSpecimenFromStraw: (id: any) => void;
  t: (key: string) => string;
  isCryoAdmin: boolean;
  isClinicAdmin: boolean;
  openModalToAddSpecimenToStraw: (row: any) => void;
}

export const DeviceColumns = ({
  openModalToEditDevice,
  onOpenModalToDeleteDevice,
  t,
  isCryoAdmin,
  isClinicAdmin,
  openModalToAddSpecimenToStraw,
}: DeviceColumnsProps) => {
  const columns = [
    {
      headerName: t('table.patient'),
      field: 'patient.id',
      renderCell: (row: { patient: { id: string; firstAndLast: string } }) =>
        row.patient.id && isCryoAdmin ? (
          <TableLink
            href={buildAdminGeneralPatientPageRoute(row.patient.id)}
            name={toPascalCase(row.patient.firstAndLast)}
            styles={{ name: 'sensitive' }}
          />
        ) : (
          <p className="sensitive">{toPascalCase(row.patient.firstAndLast)}</p>
        ),
      isShow: true,
    },
    {
      headerName: t('table.patientDOB'),
      field: 'patient.dateOfBirth',
      renderCell: (row: { patient: { dateOfBirth: string } }) =>
        row?.patient?.dateOfBirth ? formatDateWithSlashSeparator(row?.patient?.dateOfBirth) : '-',
      isShow: true,
    },
    {
      headerName: t('table.RFID'),
      field: 'rfid',
      isShow: true,
    },
    {
      headerName: t('table.locationStatus'),
      field: 'locationStatus',
      renderCell: (row: any) => <p>{LocationStatusTitle[row.locationStatus]}</p>,
      isShow: true,
    },
    {
      headerName: t('strawVialDetails.strawVialNumberDescription'),
      field: 'numberDescription',
      isShow: true,
      wrapText: true,
    },
    {
      headerName: t('table.clinic'),
      field: 'clinicName',
      renderCell: (row: any) =>
        row.clinicId && isCryoAdmin ? (
          <TableLink href={buildAdminClinicDetailsPageRoute(row.clinicId)} name={row.clinicName} />
        ) : (
          <p>{row.clinicName}</p>
        ),
      isShow: !isClinicAdmin,
      wrapText: true,
    },
    {
      headerName: t('table.facility'),
      field: 'facilityId',
      renderCell: (row: any) =>
        row.facilityId && isCryoAdmin ? (
          <TableLink href={`/admin/facilities/${row.facilityId}`} name={row.facilityName} />
        ) : (
          <p>{row.facilityName}</p>
        ),
      isShow: !isClinicAdmin,
      wrapText: true,
    },

    { headerName: t('table.vault'), field: 'vault', isShow: !isClinicAdmin, wrapText: true },
    { headerName: t('table.Tank'), field: 'tank', isShow: true, wrapText: true },
    { headerName: t('table.Pie'), field: 'pie', isShow: true },
    { headerName: t('table.Canister'), field: 'canister', isShow: true },
    { headerName: t('table.CaneNum'), field: 'cane', isShow: true },
    { headerName: t('table.canetabLabel'), field: 'caneLabel', isShow: true, wrapText: true },
    {
      headerName: t('table.canetabColor'),
      field: 'caneDescription',
      isShow: true,
      wrapText: true,
    },
    {
      headerName: t('table.numberOfSpecimens.1stPart'),
      field: 'expectedSpecimenQty',
      renderHeader: () => (
        <p className="text-center">
          {t('table.numberOfSpecimens.3rdPart')} <br /> {t('table.numberOfSpecimens.1stPart')} <br />{' '}
          {t('table.numberOfSpecimens.2ndPart')}
        </p>
      ),
      isShow: true,
    },
    {
      headerName: t('table.numberOfSpecimens.1stPart'),
      field: 'numberOfSpecimens',
      renderHeader: () => (
        <p className="text-center">
          {t('table.numberOfSpecimens.actual')} <br />
          {t('table.numberOfSpecimens.1stPart')} <br /> {t('table.numberOfSpecimens.2ndPart')}
        </p>
      ),
      isShow: true,
    },
    {
      headerName: t('specimenTable.strawColor'),
      field: 'color',
      isShow: true,
    },
    {
      headerName: 'Quantity',
      field: 'quantity',
      isShow: true,
    },
    {
      headerName: t('specimenTable.dateFreeze'),
      field: 'freezeDate',
      renderCell: (row: any) => (row.freezeDate ? <span>{formatDateWithSlashSeparator(row.freezeDate)}</span> : '-'),
      isShow: true,
    },

    {
      headerName: t('table.specimen'),
      field: 'specimenType',
      renderHeader: () => (
        <p className="text-center">
          {t('table.specimenTypes.1stPart')} <br /> {t('table.specimenTypes.2ndPart')}
        </p>
      ),
      isShow: true,
      renderCell: (row: any) => (!!row.specimenType ? getSpecimenLabels(row.specimenType) : '-'),
      wrapText: true,
    },
    {
      headerName: t('specimenTable.donorOocyte'),
      field: 'oocyteDonor.name',
      renderCell: (row: any) => conditionComponent(row?.donorOocyte),
      isShow: true,
    },
    {
      headerName: t('specimenTable.donorSperm'),
      field: 'spermDonor.name',
      renderCell: (row: any) => conditionComponent(row?.donorSperm),
      isShow: true,
    },
    {
      headerName: 'Dispose Date',
      field: 'disposeDate',
      renderCell: (row: any) => (row?.disposeDate ? formatDateWithSlashSeparator(row?.disposeDate) : '-'),
      isShow: true,
    },
    {
      headerName: 'Disposed By',
      field: 'disposedBy',
      isShow: true,
    },
    {
      headerName: 'Notes',
      field: 'notes',
      isShow: true,
      wrapText: true,
    },
    {
      field: 'action',
      headerName: 'Actions',
      isShow: isCryoAdmin,
      align: 'center',
      renderCell: (row: any) => (
        <Dropdown
          label=""
          placement="right-start"
          dismissOnClick={false}
          renderTrigger={() => (
            <div className="w-10 hover:cursor-pointer">
              <Image src={dots} alt="actions" />
            </div>
          )}>
          <div className="rounded-lg  bg-[#4F4F4F] p-[1px]">
            <Dropdown.Item className="hover:cursor-pointer" onClick={() => openModalToEditDevice(row)}>
              <PencilAlt />
              <p className="hover:bg-blue mx-2">Edit</p>
            </Dropdown.Item>
            <Dropdown.Item
              className="hover:cursor-pointer"
              onClick={() => {
                if (row?.expectedSpecimenQty > row?.numberOfSpecimens) {
                  openModalToAddSpecimenToStraw({ deviceId: row.id, specimenType: row.specimenType });
                } else {
                  toast.error(
                    `Sorry, but the maximum number of specimens has been reached. If you'd like to add more, please update your device's data`
                  );
                }
              }}>
              <FaPlus />
              <p className="hover:bg-blue mx-2">Add Specimen</p>
            </Dropdown.Item>

            <Dropdown.Item className="hover:cursor-pointer" onClick={() => onOpenModalToDeleteDevice(row.id)}>
              <MdDelete />
              <p className="mx-2">Delete</p>
            </Dropdown.Item>
          </div>
        </Dropdown>
      ),
    },
  ].filter(item => item.isShow);

  return columns;
};

export const SpecimensColumns = ({
  onOpenModalToDeleteSpecimenFromStraw,
  t,
  isCryoAdmin,
  isClinicAdmin,
  openModalToAddSpecimenToStraw,
}: SpecimensColumnsProps) => {
  const columns = [
    {
      headerName: t('table.patient'),
      field: 'patient.id',
      renderCell: (row: { patient: { id: string; firstAndLast: string } }) =>
        row.patient.id && isCryoAdmin ? (
          <TableLink
            href={buildAdminGeneralPatientPageRoute(row.patient.id)}
            name={toPascalCase(row.patient.firstAndLast)}
            styles={{ name: 'sensitive' }}
          />
        ) : (
          <p className="sensitive">{toPascalCase(row.patient.firstAndLast)}</p>
        ),
      isShow: true,
    },
    {
      headerName: t('table.patientDOB'),
      field: 'patient.dateOfBirth',
      renderCell: (row: { patient: { dateOfBirth: string } }) =>
        row?.patient?.dateOfBirth ? formatDateWithSlashSeparator(row?.patient?.dateOfBirth) : '-',
      isShow: true,
    },
    {
      headerName: t('table.RFID'),
      field: 'rfid',
      isShow: true,
    },
    {
      headerName: t('specimenTable.strawNumber'),
      field: 'numberDescription',
      isShow: true,
      wrapText: true,
    },
    {
      headerName: t('table.clinic'),
      field: 'clinicName',
      renderCell: (row: { clinicId: string; clinicName: string }) =>
        row.clinicId && isCryoAdmin ? (
          <TableLink href={buildAdminClinicDetailsPageRoute(row.clinicId)} name={row.clinicName} />
        ) : (
          <p>{row.clinicName}</p>
        ),
      isShow: !isClinicAdmin,
      wrapText: true,
    },
    {
      headerName: t('table.caneCycle'),
      field: 'cycleNumber',
    },
    {
      headerName: t('table.facility'),
      field: 'facilityId',
      renderCell: (row: { facilityId: string; facilityName: string }) =>
        row.facilityId && isCryoAdmin ? (
          <TableLink href={buildAdminFacilityDetailsPageRoute(row.facilityId)} name={row.facilityName} />
        ) : (
          <p>{row.facilityName}</p>
        ),
      isShow: !isClinicAdmin,
      wrapText: true,
    },

    { headerName: t('table.vault'), field: 'vault', isShow: !isClinicAdmin, wrapText: true },
    { headerName: t('table.Tank'), field: 'tank', isShow: true, wrapText: true },
    { headerName: t('table.Pie'), field: 'pie', isShow: true },
    { headerName: t('table.Canister'), field: 'canister', isShow: true },
    { headerName: t('table.CaneNum'), field: 'cane', isShow: true },
    { headerName: t('table.canetabLabel'), field: 'caneLabel', isShow: true, wrapText: true },
    { headerName: t('table.canetabColor'), field: 'cane', isShow: true, wrapText: true },
    {
      headerName: t('specimenTable.strawColor'),
      field: 'color',
      isShow: true,
    },
    {
      headerName: t('specimenTable.dateFreeze'),
      field: 'freezeDate',
      renderCell: (row: any) => (row.freezeDate ? <span>{formatDateWithSlashSeparator(row.freezeDate)}</span> : '-'),
      isShow: true,
    },
    {
      headerName: t('table.specimen'),
      field: 'specimenType',
      renderHeader: () => (
        <p className="text-center">
          {t('table.specimenTypes.1stPart')} <br /> {t('table.specimenTypes.2ndPart')}
        </p>
      ),
      isShow: true,
      renderCell: (row: any) => (!!row.specimenType ? getSpecimenLabels(row.specimenType) : '-'),
      wrapText: true,
    },
    { headerName: t('table.embryoNumber'), field: 'embryoOocyteNumber', isShow: true },
    {
      headerName: t('table.gradeMaturity'),
      field: 'gradeMaturity',
      isShow: true,
    },
    {
      headerName: t('specimenTable.strawPTGRezults'),
      field: 'pgtResults',
      isShow: true,
    },
    {
      headerName: t('specimenTable.strawNotes'),
      field: 'notes',
      isShow: true,
    },
    {
      field: 'action',
      headerName: 'Actions',
      isShow: isCryoAdmin,
      align: 'center',
      renderCell: (row: any) => (
        <Dropdown
          label=""
          dismissOnClick={false}
          renderTrigger={() => (
            <div className="w-10 hover:cursor-pointer">
              <Image src={dots} alt="actions" />
            </div>
          )}>
          <div className="rounded-lg  bg-[#4F4F4F] p-[1px]">
            <Dropdown.Item className="hover:cursor-pointer" onClick={() => openModalToAddSpecimenToStraw(row)}>
              <PencilAlt />
              <p className="hover:bg-blue mx-2">Edit</p>
            </Dropdown.Item>
            <Dropdown.Item
              className="hover:cursor-pointer"
              onClick={() => onOpenModalToDeleteSpecimenFromStraw(row.id)}>
              <MdDelete />
              <p className="mx-2">Delete</p>
            </Dropdown.Item>
          </div>
        </Dropdown>
      ),
    },
  ].filter(item => item.isShow);

  return columns;
};
