import { Button, Spinner } from 'flowbite-react';
import { useState } from 'react';

import FacilityDetails from './FacilityDetails';

import Inventories from './Inventories';

import useFacilityMutation from '@/api/mutations/useFacilityMutation';
import { useGetFacilityDetails } from '@/api/queries/facility.queries';
import useToggleModal from '@/hooks/useToggleModal';
import PencilAlt from '@/public/icons/PencilAlt';
import _ from 'lodash';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import CreateFacilityModal from './CreateFacilityModal';
import ConfirmationModal from '@/components/ConfirmationModal/ConfirmationModal';
import { NotFound } from '../NotFound/NotFound';
import { NOT_FOUND_STATUS_CODE } from '@/constants/errorCodes';

const FacilityOverview = () => {
  const { t } = useTranslation('facilities');
  const router = useRouter();

  const [openAlert, toggleAlert] = useState(false);
  const [activeId, setActiveId] = useState('');

  const { isModalOpen, onCloseModal, onOpenModal } = useToggleModal();

  const {
    data: facility,
    isLoading,
    mutate: refetchFacility,
    error,
  } = useGetFacilityDetails({ id: router.query.id as string });
  const { deleteFacility } = useFacilityMutation();

  const onOpenAlert = (id: string) => {
    setActiveId(id);
    toggleAlert(true);
  };

  const onCloseAlert = () => {
    toggleAlert(false);
    setActiveId('');
  };

  const closeEditModal = () => {
    onCloseModal();
    refetchFacility();
  };

  const onDeleteFacility = () => {
    deleteFacility
      .trigger({ id: activeId })
      .then(() => {})
      .catch(reason => {
        if (reason?.response?.data) {
          if (
            _.isArray(reason.response.data?.errors?.FacilityId) &&
            reason.response.data?.errors?.FacilityId.length > 1
          ) {
            reason.response.data?.errors?.FacilityId.forEach((el: any) => toast.error(el));
          } else {
            toast.error(reason.response.data?.errors?.FacilityId[0]);
          }
        }
      })
      .finally(() => {
        onCloseAlert();
        router.back();
      });
  };

  if (isLoading) {
    return (
      <div data-testid="loading-spinner" className="z-20 flex h-full w-full justify-center rounded-lg backdrop-blur-sm">
        <div className="flex items-center justify-center gap-2 text-sm text-white">
          <Spinner size="sm" className="mt-[-1px]" /> {t('common:loadingWithDots')}
        </div>
      </div>
    );
  }

  if (error && error?.response?.status == NOT_FOUND_STATUS_CODE) {
    return <NotFound text={t('notFound:facilityNotFound')} />;
  }

  return (
    <div data-testid="facility-overview">
      <ConfirmationModal
        isOpen={openAlert}
        onClose={onCloseAlert}
        onConfirm={onDeleteFacility}
        isLoading={deleteFacility.isMutating}
        title={t('common:delete')}
        message={t('common:deleteConfirmation')}
      />
      <CreateFacilityModal isOpen={isModalOpen} onClose={closeEditModal} facilityData={facility} />

      <div data-testid="facility-header" className="mb-4 flex items-center justify-between md:mb-10">
        <h1 className="w-auto truncate bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-5xl font-light leading-[60px] text-transparent">
          {facility?.name}
        </h1>
        <Button
          data-testid="edit-facility-button"
          onClick={onOpenModal}
          className="flex gap-2 border-0"
          size="sm"
          gradientDuoTone="primary">
          <div className="flex items-center gap-2">
            <PencilAlt />
            {t('editFacility')}
          </div>
        </Button>
      </div>

      {facility && (
        <div data-testid="facility-details-section" className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="w-full">
            <div
              data-testid="facility-details"
              className="flex w-full flex-col rounded-md border border-transparent p-4 sm:p-8 dark:bg-[#1E2021]">
              <FacilityDetails facility={facility} />

              <div className="pt-4">
                <Button
                  data-testid="delete-facility-button"
                  outline
                  gradientDuoTone="pinkToOrange"
                  onClick={() => onOpenAlert(facility?.id)}
                  disabled={facility?.vaultsCount > 0}>
                  Delete facility
                </Button>
              </div>
            </div>
          </div>

          <div data-testid="inventories-section" className="w-full">
            <Inventories />
          </div>
        </div>
      )}
    </div>
  );
};

export default FacilityOverview;
