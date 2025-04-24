import { buildAdminGeneralPatientPageRoute } from '@/constants/buildRoutes';
import { LocationStatus } from '@/constants/specimens';
import useRole from '@/hooks/useRole';
import useToggleModal from '@/hooks/useToggleModal';
import { CaneDetails, DetailsTitle, SpecimanDetailsByCane } from '@/types/view/Specimen.interface';
import { isUserAccountAdmin, isUserAdmin, isUserClinicAdmin, isUserGodAdmin } from '@/utils';
import { conditionComponent } from '@/utils/conditionComponent';
import { formatDataWithTime } from '@/utils/formatDataWithTime';
import { formatDateWithSlashSeparator } from '@/utils/formatDateWithSlashSeparator';
import { getClinicLabels } from '@/utils/getClinicLabels';
import { getLocationStatusLabels } from '@/utils/getLocationStatusLabels';
import { useState } from 'react';
type DeleteItemType = 'device' | 'cane' | 'specimen' | null;
interface ModalContent {
  title: string;
  description: string;
}

export const getDetailsTable = (t: any, speciman: CaneDetails | undefined, user: any) => {
  const roles = user?.['.roles'];
  // utils
  const isClinicAdmin = isUserClinicAdmin(roles);
  const isNetworkAdmin = isUserAccountAdmin(roles);
  const isReadOnly = isClinicAdmin || isNetworkAdmin;

  // links
  const patientLink = isReadOnly
    ? `/clinic/patients/${speciman?.patientId}`
    : speciman?.patientId
    ? buildAdminGeneralPatientPageRoute(speciman?.patientId)
    : '';
  const clinicLink = !isReadOnly ? `/admin/clinics/${speciman?.clinicId}/general` : undefined;
  const patientClinicLink = !isReadOnly ? `/admin/clinics/${speciman?.patientClinicId}/general` : undefined;
  const facilityLink = !isReadOnly ? `/admin/facilities/${speciman?.facilityId}` : undefined;

  // card info
  const locationDetails = [
    {
      name: t('locationDetails.facility'),
      value: speciman?.facilityName,
      link: facilityLink,
    },
    {
      name: t('locationDetails.vault'),
      value: speciman?.vault,
    },
    {
      name: t('locationDetails.tank'),
      value: speciman?.tank,
    },
    {
      name: t('locationDetails.pie'),
      value: speciman?.pie,
    },
    {
      name: t('locationDetails.canister'),
      value: speciman?.canister,
    },
    {
      name: t('caneDetails.slot'),
      value: speciman?.number,
    },
  ];

  const caneDetails = [
    {
      name: t('table.receiptDate'),
      value: speciman?.receiptDate ? formatDateWithSlashSeparator(speciman?.receiptDate) : null,
    },
    {
      name: t('caneDetails.rfid'),
      value: speciman?.rfid || '-',
    },
    {
      name: t('caneDetails.expectedStrawVialQty'),
      value: speciman?.expectedDeviceQty,
    },
    {
      name: t('caneDetails.actualDeviceNumber'),
      value: speciman?.devices?.length,
    },
    {
      name: t('table.caneLabel'),
      value: speciman?.caneLabel,
    },
    {
      name: t('strawVialDetails.cane_description'),
      value: speciman?.caneDescription,
    },
    {
      name: t('table.caneCycle'),
      value: speciman?.cycleNumber,
    },
    {
      name: t('table.aneuploidDisposeConsent'),
      value: speciman?.disposeAneuploidConsent,
    },
    {
      name: t('table.abandonedTissue'),
      value: speciman?.abandonedTissue,
    },
    {
      name: t('table.keepAneuploidAndBill'),
      value: speciman?.keepAneuploid,
    },
    {
      name: t('table.allAneuploidEmbryosinCane'),
      value: speciman?.allAneuploidEmbryoStatus,
    },
    {
      name: t('table.idLabResult'),
      value: speciman?.idLabResult,
    },
    {
      name: t('table.reactivity'),
      value: conditionComponent(!!speciman?.reactivity),
    },
    {
      name: t('table.reactive'),
      value: speciman?.reactiveStatus,
    },
    {
      name: t('table.FDAEligibility'),
      value: speciman?.fdaEligibility,
    },
  ];

  const patientDetails = [
    {
      name: t('patientDetails.email'),
      value: speciman?.patient?.email,
      styles: { value:'sensitive' },
    },
    {
      name: t('patientDetails.fullName'),
      value: speciman?.patient?.firstAndLast,
      link: patientLink,
      styles: { value:'sensitive' },
    },
    {
      name: t('patientDetails.freezeDate'),
      value: speciman?.freezeDate,
    },
    {
      name: t('generalInformation.clinicName'),
      value: speciman?.patientClinicName,
      link: patientClinicLink,
    },
  ];

  const generalInformation = [
    {
      name: t('generalInformation.createdAt'),
      value: formatDataWithTime(speciman?.createdAt || ''),
      show: true,
    },
    {
      name: t('table.primaryIdentifier'),
      value: speciman?.primaryIdentifier?.email,
      show: !isReadOnly,
      styles: { value:'sensitive' },
    },
    {
      name: t('table.secondaryIdentifier'),
      value: speciman?.secondaryIdentifier?.email,
      show: !isReadOnly,
      styles: { value:'sensitive' },
    },
  ].filter(item => !!item.show);

  const clinicDetails = [
    {
      name: t('generalClinicInfo.clinicName'),
      value: speciman?.clinicName,
      link: clinicLink,
    },
    {
      name: t('generalClinicInfo.clinicType'),
      value: speciman?.clinicType ? getClinicLabels(speciman?.clinicType) : '',
    },
    {
      name: t('generalClinicInfo.primaryContactTitle'),
      value: speciman?.clinicContactDetails,
    },
  ];

  const caneStatus = [
    {
      name: t('statusInfo.status'),
      value: speciman?.locationStatus ? getLocationStatusLabels(speciman?.locationStatus) : '',
    },
    {
      name: t('statusInfo.disposedAt'),
      value: speciman?.disposedAt ? formatDateWithSlashSeparator(speciman?.disposedAt) : '',
    },
    {
      name: t('statusInfo.disposedBy'),
      value: speciman?.disposedBy || '',
    },
  ];

  return { locationDetails, caneDetails, patientDetails, generalInformation, clinicDetails, caneStatus };
};

export const getDetailsTitles = (t: (key: string) => string): DetailsTitle => {
  return {
    locationTitle: t('detailsPage.specimenLocation'),
    caneTitle: t('detailsPage.specimenCane'),
    noteTitle: t('detailsPage.specimenNotes'),
    patientTitle: t('detailsPage.specimenPatientData'),
    strawVialTitle: t('detailsPage.straw'),
    generalInformationTitle: t('detailsPage.generalInfo'),
    generalClinicInformationTitle: t('detailsPage.generalClinicInfo'),
    statusTitle: t('detailsPage.caneStatus'),
  };
};

export const useManageCaneDetailsModals = (speciman: CaneDetails | undefined) => {
  const [selectedItemToDelete, setSelectedItemToDelete] = useState<{
    id: string;
    type: DeleteItemType;
  }>({ id: '', type: null });
  const [selectedDevice, setSelectedDevice] = useState<SpecimanDetailsByCane | null>(null);
  const [selectedSpecimen, setSelectedSpecimen] = useState<SpecimanDetailsByCane | null>(null);

  const { roles } = useRole();
  const isSpecialDisposedStatus = (status: LocationStatus | undefined): boolean => {
    if (!status) return false;
    const disposedStatuses = [LocationStatus.Thawed, LocationStatus.Discarded, LocationStatus.Donated];
    return disposedStatuses.includes(status);
  };
  // We cannot edit cane if it has Thawed/Discarded/Donated status
  const canEditCane =
    (isUserAdmin(roles) || isUserGodAdmin(roles)) && !isSpecialDisposedStatus(speciman?.locationStatus);
  const showAddSpecimenbtn = (speciman?.expectedDeviceQty ?? 0) > (speciman?.devices?.length ?? 0) && canEditCane;

  const {
    isModalOpen: isEditDeviceModalOpen,
    onCloseModal: onEditDeviceCloseModal,
    onOpenModal: onEditDeviceOpenModal,
  } = useToggleModal();

  const {
    isModalOpen: isEditCaneModalOpen,
    onCloseModal: onEditCaneCloseModal,
    onOpenModal: onEditCaneOpenModal,
  } = useToggleModal();

  const {
    isModalOpen: isModalDeleteSpecimenOpen,
    onCloseModal: onCloseDeleteSpecimenModal,
    onOpenModal: onOpenDeleteSpecimenModal,
  } = useToggleModal();

  const {
    isModalOpen: isModalAddSpecimenToStrawOpen,
    onCloseModal: onCloseAddSpecimenToStrawModal,
    onOpenModal: onOpeAddSpecimenToStrawModal,
  } = useToggleModal();

  const {
    isModalOpen: isAddDevicesOpen,
    onCloseModal: onCloseAddDevicesModal,
    onOpenModal: onOpeAddDevicesModal,
  } = useToggleModal();

  const {
    isModalOpen: isAddLocationOpen,
    onCloseModal: onCloseAddLocationModal,
    onOpenModal: onOpeAddLocationModal,
  } = useToggleModal();

  const openModalToEditDevice = (data: any) => {
    setSelectedDevice(data);
    onEditDeviceOpenModal();
  };

  const onOpenModalToDeleteDevice = (id: string) => {
    setSelectedItemToDelete({ id, type: 'device' });
    onOpenDeleteSpecimenModal();
  };

  const onCloseModalToDeleteDevice = () => {
    onCloseDeleteSpecimenModal();
  };

  const onOpenModalToDeleteCane = (id: string) => {
    setSelectedItemToDelete({ id, type: 'cane' });
    onOpenDeleteSpecimenModal();
  };

  const openModalToAddSpecimenToStraw = (data: any) => {
    setSelectedSpecimen(data);
    onOpeAddSpecimenToStrawModal();
  };

  const onOpenModalToDeleteSpecimenFromStraw = (id: string) => {
    setSelectedItemToDelete({ id: id, type: 'specimen' });
    onOpenDeleteSpecimenModal();
  };
  const {
    isModalOpen: isUpdateCaneLocationModalOpen,
    onCloseModal: onCloseUpdateCaneLocationModal,
    onOpenModal: onOpenUpdateCaneLocationModal,
  } = useToggleModal();

  const {
    isModalOpen: isUpdateRfidModalOpen,
    onCloseModal: onCloseUpdateRfidModal,
    onOpenModal: onOpenUpdateRfidModal,
  } = useToggleModal();

  return {
    activeItem: selectedItemToDelete,
    selectedDevice,
    showAddSpecimenbtn,
    isEditDeviceModalOpen,
    onEditDeviceCloseModal,
    onEditDeviceOpenModal,
    isEditCaneModalOpen,
    onEditCaneCloseModal,
    onEditCaneOpenModal,
    isModalDeleteSpecimenOpen,
    onCloseDeleteSpecimenModal,
    onOpenDeleteSpecimenModal,
    openModalToEditDevice,
    onOpenModalToDeleteDevice,
    onCloseModalToDeleteDevice,
    onOpenModalToDeleteCane,
    canEditCane,
    isModalAddSpecimenToStrawOpen,
    openModalToAddSpecimenToStraw,
    onCloseAddSpecimenToStrawModal,
    selectedSpecimen,
    onOpenModalToDeleteSpecimenFromStraw,
    isUpdateCaneLocationModalOpen,
    onCloseUpdateCaneLocationModal,
    onOpenUpdateCaneLocationModal,
    isAddDevicesOpen,
    onOpeAddDevicesModal,
    onCloseAddDevicesModal,
    isAddLocationOpen,
    onOpeAddLocationModal,
    onCloseAddLocationModal,
    isUpdateRfidModalOpen,
    onCloseUpdateRfidModal,
    onOpenUpdateRfidModal,
  };
};

export function getModalContent(type: DeleteItemType, t: any): ModalContent {
  switch (type) {
    case 'device':
      return {
        title: t('modal.deleteStraw'),
        description: t('common:deleteConfirmation'),
      };
    case 'cane':
      return {
        title: t('modal.discardCane'),
        description: t('common:deleteConfirmation'),
      };
    case 'specimen':
      return {
        title: t('modal.deleteSpecimen'),
        description: t('common:deleteConfirmation'),
      };
    default:
      return {
        title: '',
        description: '',
      };
  }
}

export const caneLocationHistoryTypeToText = (type: string | null | undefined): string => {
  if (!type) return '-';

  const typeMapping: Record<string, string> = {
    Transferred: 'Transferred',
    Thawed: 'Thawed',
    Discarded: 'Discarded',
    Donated: 'Donated',
    LocationAdded: 'Location Added',
    LocationUpdated: 'Location Updated',
    ReturnToCryoFuture: 'Returned to CryoFuture',
    StayAtClinic: 'Stayed at Clinic',
  };

  return typeMapping[type] || '-';
};
