import useInventoryMutation from '@/api/mutations/useInventoryMutation';
import {
  useGetCaneById,
  useGetCaneLocationHistory,
  useGetCaneNotes,
  useGetDevicesByCane,
  useGetSpecimensByCane,
} from '@/api/queries/speciment.queries';
import ConfirmationModal from '@/components/ConfirmationModal/ConfirmationModal';
import DataGridTable from '@/components/DataGrid/DataGridTable';
import Pagination from '@/components/Pagination/Pagination';
import { buildAdminGeneralPatientPageRoute } from '@/constants/buildRoutes';
import { NOT_FOUND_STATUS_CODE } from '@/constants/errorCodes';
import { NotFound } from '@/features/NotFound/NotFound';
import AddCaneLocationModal from '@/features/PickList/SetLocationModal/AddCaneLocationModal';
import DetailsCard from '@/features/Transportation/DetailsCard';
import useRole from '@/hooks/useRole';
import { useTableControls } from '@/hooks/useTableControls';
import useToggleModal from '@/hooks/useToggleModal';
import PencilAlt from '@/public/icons/PencilAlt';
import { TNotes } from '@/types/view/Notes.type';
import { isSmallScreen, isUserAdmin, isUserClinicAdmin, isUserGodAdmin } from '@/utils';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Button, Spinner } from 'flowbite-react';
import _ from 'lodash';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FaBox, FaHospital, FaPrint, FaRegCheckCircle, FaStickyNote, FaUser } from 'react-icons/fa';
import { FaCircleInfo, FaMapLocationDot } from 'react-icons/fa6';
import { toast } from 'react-toastify';
import CaneNotes from '../CaneNotes/CaneNotes';
import PrintRFIDModal from '../PrintRFID/PrintRFIDModal';
import AddDevicesSeparateModal from './AddDevicesSeparateModal/AddDevicesSeparateModal';
import AddSpecimenModal from './AddSpecimenModal/AddSpecimenModal';
import { getDetailsTable, getDetailsTitles, getModalContent, useManageCaneDetailsModals } from './CaneDetails.utils';
import { DeviceColumns, SpecimensColumns } from './CaneDetailsColumns';
import EditCaneModal from './EditCaneModal/EditCaneModal';
import EditDeviceModal from './EditDeviceModal/EditDeviceModal';
import CaneLocationHistoryTable from './LocationHistory';
import SpecimenDetailsCardHeader from './SpecimenDetailsCardHeader';
import UpdateCaneLocationModal from './UpdateOnlyCaneLocationModal';
import EditRfidModal from './EditRfid/EditRfidModal';

const CaneDetails = () => {
  // utils
  const router = useRouter();
  const { t } = useTranslation('specimens');
  const { user } = useUser();
  const { roles } = useRole();
  const isCryoAdmin = isUserAdmin(roles) || isUserGodAdmin(roles);
  const isClinicAdmin = isUserClinicAdmin(roles);
  // states
  const [notesList, setNotesList] = useState<TNotes[] | []>([]);
  const [devicesList, setDevicesList] = useState<any>(null);
  const [specimenList, setSpecimensList] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('devices');
  //caneDetails
  const { data: cane, isLoading, mutate: refetchCaneDetailsInfo, error } = useGetCaneById(router?.query?.id as string);
  const { data: caneNotes, mutate: refetchNotes } = useGetCaneNotes({
    params: {
      caneId: router?.query?.id as string,
    },
  });
  const {
    data: caneHistory,
    isLoading: isLoadingHistory,
    mutate: refetchHistory,
  } = useGetCaneLocationHistory({
    params: {
      caneId: router?.query?.id as string,
    },
  });

  const { pagination: paginationDevices } = useTableControls(devicesList, {});
  const { pagination: paginationSpecimens } = useTableControls(specimenList, {});
  const {
    data: specimensData,
    isLoading: isLoadingSpecimenData,
    mutate: refetchSpecimens,
  } = useGetSpecimensByCane({
    params: {
      pageSize: paginationSpecimens.size,
      pageNumber: paginationSpecimens.currentPage,
    },
    caneId: router?.query?.id as string,
  });
  const {
    data: devicesData,
    isLoading: isLoadingDevicesData,
    mutate: refetchDevices,
  } = useGetDevicesByCane({
    params: {
      pageSize: paginationDevices.size,
      pageNumber: paginationDevices.currentPage,
    },
    caneId: router?.query?.id as string,
  });
  const { deleteDevice, deleteCane, deleteSpecimen, updateRfid } = useInventoryMutation();

  const {
    activeItem,
    selectedDevice,
    showAddSpecimenbtn,
    isEditDeviceModalOpen,
    onEditDeviceCloseModal,
    isEditCaneModalOpen,
    onEditCaneCloseModal,
    onEditCaneOpenModal,
    isModalDeleteSpecimenOpen,
    onCloseDeleteSpecimenModal,
    openModalToEditDevice,
    onOpenModalToDeleteDevice,
    onCloseModalToDeleteDevice,
    onOpenModalToDeleteCane,
    onOpenModalToDeleteSpecimenFromStraw,
    canEditCane,
    isModalAddSpecimenToStrawOpen,
    openModalToAddSpecimenToStraw,
    onCloseAddSpecimenToStrawModal,
    selectedSpecimen,
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
    onOpenUpdateRfidModal,
    onCloseUpdateRfidModal,
  } = useManageCaneDetailsModals(cane);

  const {
    isModalOpen: isPrintRFIDModalOpen,
    onCloseModal: onClosePrintRFIDModal,
    onOpenModal: onOpenPrintRFIDModal,
  } = useToggleModal();

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
  };

  const getTabClassName = (tabName: string) => {
    return activeTab === tabName
      ? 'border-blue-600 cursor-pointer border-b-[1px] text-transparent bg-clip-text bg-gradient-to-r from-cryo-blue to-cryo-cyan font-medium'
      : '';
  };

  const { locationDetails, caneDetails, patientDetails, generalInformation, clinicDetails, caneStatus } =
    getDetailsTable(t, cane, user);

  const {
    locationTitle,
    caneTitle,
    patientTitle,
    generalInformationTitle,
    generalClinicInformationTitle,
    noteTitle,
    statusTitle,
  } = getDetailsTitles(t);

  const onDeleteSpecimen = () => {
    if (activeItem?.type == 'cane') {
      deleteCane
        .trigger({ id: activeItem?.id })
        .then(() => {
          toast.success(`${t('errors.deleteCaneSuccess')}`);
          router.push(buildAdminGeneralPatientPageRoute(cane?.patientId || ''));
        })
        .catch(reason => {
          if (reason?.response?.data) {
            toast.error(reason.response.data?.errors?.CaneId[0]);
          }
        })
        .finally(() => {
          onCloseDeleteSpecimenModal();
        });
    } else if (activeItem?.type === 'specimen') {
      deleteSpecimen
        .trigger({ id: activeItem?.id })
        .then(() => {
          // @ts-ignore
          refetchSpecimens(undefined, { revalidate: true });
          // @ts-ignore
          refetchDevices(undefined, { revalidate: true });
        })
        .catch(reason => {
          if (reason?.response?.data) {
            toast.error(reason.response.data?.errors?.CaneId[0]);
          }
        })
        .finally(() => {
          onCloseDeleteSpecimenModal();
        });
    } else {
      deleteDevice
        .trigger({ id: activeItem?.id })
        .then(() => {
          // @ts-ignore
          refetchCaneDetailsInfo(undefined, { revalidate: true });
          // @ts-ignore
          refetchDevices(undefined, { revalidate: true });
        })
        .catch(reason => {
          if (reason?.response?.data) {
            toast.error(reason.response.data?.errors?.Specimen[0]);
          }
        })
        .finally(() => {
          onCloseDeleteSpecimenModal();
        });
    }
  };

  useEffect(() => {
    if (!isLoadingDevicesData && devicesData) {
      setDevicesList({
        ...devicesData,
        items: devicesData?.items?.map((item: any) => {
          return {
            ...item,
            processed:
              item.disposeStatus === 'Thawed' || item.disposeStatus === 'Discarded' || item.disposeStatus === 'Donated',
          };
        }),
      });
    }
  }, [devicesData, isLoadingDevicesData]);

  useEffect(() => {
    if (!isLoadingSpecimenData && specimensData) {
      setSpecimensList(specimensData);
    }
  }, [specimensData, isLoadingSpecimenData]);

  useEffect(() => {
    if (caneNotes?.items?.length) {
      const newList = caneNotes?.items.map((n: any) => {
        return { ...n, isDisabled: true };
      });
      setNotesList(newList);
    }
  }, [caneNotes]);

  if (isLoading) {
    return (
      <div className="absolute z-20 flex h-full w-full items-center justify-center rounded-lg	bg-black/10 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-2 text-sm text-white">
          <Spinner size="sm" className="mt-[-1px]" /> {t('common:loadingWithDots')}
        </div>
      </div>
    );
  }

  if (error && error?.response?.status == NOT_FOUND_STATUS_CODE) {
    return <NotFound text={t('notFound:caneDetailsNotFound')} />;
  }

  return (
    <div className="pb-10">
      {!isSmallScreen() && (
        <div className="flex items-end justify-between md:mb-10">
          <h1 className="w-auto bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-5xl font-light leading-[60px] text-transparent ">
            {t('detailsPage.specimenDetails')}
          </h1>
          <Button gradientDuoTone={'primary'} outline size={'md'} onClick={onOpenPrintRFIDModal}>
            <div className="mr-2">
              <FaPrint />
            </div>
            Print RFID Label
          </Button>
        </div>
      )}

      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex w-full flex-col gap-4">
          <DetailsCard
            details={generalInformation}
            title={generalInformationTitle}
            icon={<FaCircleInfo />}
            isLoading={isLoading}></DetailsCard>
          <DetailsCard
            details={caneStatus}
            title={statusTitle}
            icon={<FaRegCheckCircle />}
            isLoading={isLoading}></DetailsCard>
          <DetailsCard
            details={clinicDetails}
            title={generalClinicInformationTitle}
            icon={<FaHospital />}
            isLoading={isLoading}></DetailsCard>
          <DetailsCard
            details={locationDetails}
            title={locationTitle}
            icon={<FaMapLocationDot />}
            isLoading={isLoading}></DetailsCard>
        </div>
        <div className="flex w-full flex-col gap-4">
          <DetailsCard
            details={patientDetails}
            title={patientTitle}
            icon={<FaUser />}
            isLoading={isLoading}></DetailsCard>
          <DetailsCard
            details={caneDetails}
            title={caneTitle}
            icon={<FaBox />}
            headerNode={
              canEditCane ? (
                <SpecimenDetailsCardHeader
                  id={cane?.id || ''}
                  openEditModal={onEditCaneOpenModal}
                  onOpenDeleteModal={onOpenModalToDeleteCane}
                  editBtnlabel={t('modal.editCane')}
                  deleteBtnlabel={t('modal.discardCane')}
                  updateCaneLocationBtnlabel={t('modal.updateCaneLocation')}
                  openUpdateCaneLocationModal={onOpenUpdateCaneLocationModal}
                  addCaneLocationBtnlabel={'Add Cane Location'}
                  openAddCaneLocationModal={onOpeAddLocationModal}
                  updateRfidBtnlabel={t('modal.editRfid')}
                  openUpdateRfidModal={onOpenUpdateRfidModal}
                  showUpdateLocation={!!cane?.slotId && !!cane?.facilityId}
                  showAddLocation={!cane?.slotId && !!cane?.facilityId}
                />
              ) : null
            }
            isLoading={isLoading}></DetailsCard>
          <CaneLocationHistoryTable caneHistory={caneHistory} isLoading={isLoadingHistory} />
          {cane?.notes && (
            <div className="flex min-w-full max-w-[370px] flex-col  gap-3 rounded-md border border-transparent px-4 py-4 sm:px-8 sm:py-8 md:max-w-full dark:bg-[#1E2021]">
              <div className="flex items-center justify-start gap-3 text-white">
                <div className="ustify-center flex h-[25px] w-[25px]">{<FaStickyNote />}</div>
                <span className="text-2xl font-normal text-white">{noteTitle}</span>
              </div>
              <div
                key={cane?.id}
                className="my-2 flex justify-between gap-12 rounded-md border border-transparent px-4 py-3 text-sm font-normal leading-tight text-gray-300 dark:bg-[#292B2C]">
                <span className="overflow-wrap-all flex items-center text-sm font-normal text-[#828282]">
                  {cane?.notes}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      <CaneNotes notes={notesList} title={'Cane Notes'} refetchNotes={refetchNotes} />
      {showAddSpecimenbtn && (
        <div className="my-5">
          <Button
            gradientDuoTone={'primary'}
            size={'sm'}
            onClick={() => {
              onOpeAddDevicesModal();
            }}>
            <div className="mr-2">
              <PencilAlt />
            </div>
            {t('modal.addDevices')}
          </Button>
        </div>
      )}
      <div>
        <div className="mb-4 flex h-6 flex-row gap-8 text-sm font-medium leading-[150%] text-[#F9FAFB]">
          <div className={getTabClassName('devices')} onClick={() => handleTabClick('devices')}>
            {t('devices')}
          </div>
          <div className={getTabClassName('specimen')} onClick={() => handleTabClick('specimen')}>
            {t('specimens')}
          </div>
        </div>
        {activeTab === 'devices' ? (
          <>
            <DataGridTable
              columns={DeviceColumns({
                openModalToEditDevice,
                onOpenModalToDeleteDevice,
                t,
                isCryoAdmin,
                isClinicAdmin,
                openModalToAddSpecimenToStraw,
              })}
              rows={devicesList?.items || []}
              isLoading={isLoadingDevicesData}
            />
            {!_.isEmpty(devicesList?.items) ? (
              <div className="flex pt-8">
                <Pagination {...paginationDevices} />
              </div>
            ) : null}
          </>
        ) : (
          <>
            <DataGridTable
              columns={SpecimensColumns({
                onOpenModalToDeleteSpecimenFromStraw,
                t,
                isCryoAdmin,
                isClinicAdmin,
                openModalToAddSpecimenToStraw,
              })}
              rows={specimenList?.items || []}
              isLoading={isLoadingSpecimenData}
            />
            {!_.isEmpty(specimenList?.items) ? (
              <div className="flex pt-8">
                <Pagination {...paginationSpecimens} />
              </div>
            ) : null}
          </>
        )}
      </div>

      <EditDeviceModal
        isOpen={isEditDeviceModalOpen}
        onClose={onEditDeviceCloseModal}
        refetchPatientInfo={() => {
          refetchCaneDetailsInfo();
          refetchDevices();
        }}
        caneId={cane?.id || ''}
        deviceData={selectedDevice}
      />
      {isCryoAdmin && (
        <EditCaneModal
          isOpen={isEditCaneModalOpen}
          onClose={onEditCaneCloseModal}
          refetchCaneInfo={refetchCaneDetailsInfo}
          caneData={cane}
        />
      )}
      <ConfirmationModal
        isOpen={isModalDeleteSpecimenOpen}
        onClose={onCloseModalToDeleteDevice}
        onConfirm={onDeleteSpecimen}
        isLoading={deleteDevice.isMutating || deleteCane.isMutating}
        title={getModalContent(activeItem?.type, t).title}
        message={getModalContent(activeItem?.type, t).description}
      />
      <AddSpecimenModal
        isOpen={isModalAddSpecimenToStrawOpen}
        onClose={onCloseAddSpecimenToStrawModal}
        refetchPatientInfo={() => {
          refetchDevices();
          refetchSpecimens();
        }}
        specimenData={selectedSpecimen}
      />
      {isCryoAdmin && (
        <UpdateCaneLocationModal
          isOpen={isUpdateCaneLocationModalOpen}
          onClose={onCloseUpdateCaneLocationModal}
          refetchCanesInfo={() => {
            refetchCaneDetailsInfo();
            refetchDevices();
            refetchSpecimens();
            refetchHistory();
          }}
          caneDetails={cane}
        />
      )}
      <PrintRFIDModal isOpen={isPrintRFIDModalOpen} onClose={onClosePrintRFIDModal} caneData={cane} />

      <AddDevicesSeparateModal
        isOpen={isAddDevicesOpen}
        onClose={onCloseAddDevicesModal}
        devicesCount={Math.max((cane?.expectedDeviceQty ?? 1) - (cane?.devices?.length ?? 1), 1)}
        caneId={cane?.id || ''}
        refetchCaneInfo={() => {
          refetchCaneDetailsInfo();
          refetchDevices();
        }}
      />

      {isCryoAdmin && (
        <AddCaneLocationModal
          isOpen={isAddLocationOpen}
          onClose={onCloseAddLocationModal}
          refetchCanesInfo={() => {
            refetchCaneDetailsInfo();
            refetchDevices();
            refetchHistory();
          }}
          cane={cane}
          pickListId={cane?.pickListId || ''}
        />
      )}

      {isCryoAdmin && (
        <EditRfidModal
          isOpen={isUpdateRfidModalOpen}
          onClose={onCloseUpdateRfidModal}
          refetchCaneInfo={refetchCaneDetailsInfo}
          refetchDevices={refetchDevices}
          refetchSpecimens={refetchSpecimens}
          cane={cane}
        />
      )}
    </div>
  );
};

export default CaneDetails;
