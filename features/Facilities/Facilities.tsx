import classNames from 'classnames';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';
import { Button, Spinner } from 'flowbite-react';
import Facility from './Facility';

import { ApiTypes } from '@/types';
import { HiPlus } from 'react-icons/hi';

import Pagination from '@/components/Pagination/Pagination';
import { useTableControls } from '@/hooks/useTableControls';
import { useGetFacilities } from '@/api/queries/facility.queries';
import DynamicNamespaces from 'next-translate/DynamicNamespaces';
import CreateFacilityModal from './CreateFacilityModal';
import useToggleModal from '@/hooks/useToggleModal';
import useFacilityMutation from '@/api/mutations/useFacilityMutation';
import { toast } from 'react-toastify';
import _ from 'lodash';
import ConfirmationModal from '@/components/ConfirmationModal/ConfirmationModal';

const Facilities = () => {
  const { t } = useTranslation('facilities');
  const [facilities, setFacilities] = useState<null | ApiTypes.FacilityResponse>(null);
  const [loadingFacility, setLoadingFacility] = useState(false);
  const [openAlert, toggleAlert] = useState(false);
  const [activeId, setActiveId] = useState('');

  const { isModalOpen, onCloseModal, onOpenModal } = useToggleModal();

  const { filters, pagination } = useTableControls(facilities, { state: '', parent: '' }, 10);

  const { deleteFacility } = useFacilityMutation();

  const {
    data: facilityData,
    isLoading,
    mutate,
  } = useGetFacilities({
    pageSize: pagination.size,
    pageNumber: pagination.currentPage,
  });

  useEffect(() => {
    if (isLoading) {
      setLoadingFacility(true);
    }
    if (!isLoading && facilityData) {
      setTimeout(() => {
        setFacilities(facilityData);
        setLoadingFacility(false);
      }, 500);
    }
  }, [facilityData, isLoading]);

  const onClose = (isSubmitted?: boolean) => {
    if (isSubmitted) {
      mutate(undefined, { revalidate: true });
    }
    onCloseModal();
  };

  const onOpenAlert = (id: string) => {
    setActiveId(id);
    toggleAlert(true);
  };

  const onCloseAlert = () => {
    toggleAlert(false);
    setActiveId('');
  };

  const onDeleteFacility = () => {
    deleteFacility
      .trigger({ id: activeId })
      .then(() => {
        mutate(undefined, { revalidate: true });
      })
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
      .finally(() => onCloseAlert());
  };

  return (
    <>
      <ConfirmationModal
        isOpen={openAlert}
        onClose={onCloseAlert}
        onConfirm={onDeleteFacility}
        isLoading={deleteFacility.isMutating}
        title={t('common:delete')}
        message={t('common:deleteConfirmation')}
      />

      <h1
        className="mb-8 h-14 w-56 bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-5xl font-light text-transparent"
        data-testid="facilities-title">
        {t('title')}
      </h1>

      <div
        className={classNames('flex w-full grid-cols-2 flex-wrap  items-start justify-between', {
          'mb-4': filters.isFiltering,
          'mb-8': !filters.isFiltering,
        })}>
        <div className="flex w-full  items-center justify-end">
          <Button
            onClick={onOpenModal}
            className="border-0"
            size="sm"
            gradientDuoTone="primary"
            data-testid="add-facility-button">
            <HiPlus className="mr-2 text-lg" />
            {t('addFacility')}
          </Button>
        </div>
      </div>

      <div
        data-testid="facilities-list"
        className="relative grid grid-flow-row grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {loadingFacility && (
          <div
            data-testid="facilities-loading"
            className="absolute inset-0 z-20 flex items-center justify-center rounded-lg bg-black/10 backdrop-blur-sm md:mt-60">
            <div className="flex items-center justify-center gap-2 text-sm text-white">
              <Spinner size="sm" className="mt-[-1px]" /> {t('common:loadingWithDots')}
            </div>
          </div>
        )}

        {facilities?.items.length
          ? facilities.items?.map((facility, index) => (
              <Facility key={index} facility={facility} onDelete={onOpenAlert} />
            ))
          : null}
      </div>

      {facilities?.items.length === 0 && !loadingFacility ? (
        <div data-testid="no-facilities-message" className="pt-5 text-center text-sm">
          {t('noFacilities')}
        </div>
      ) : null}

      {facilities?.items.length ? (
        <div className="flex justify-center pb-8" data-testid="pagination">
          <Pagination {...pagination} />
        </div>
      ) : null}

      <DynamicNamespaces namespaces={['clinics']} fallback="Loading...">
        <CreateFacilityModal isOpen={isModalOpen} onClose={onClose} />
      </DynamicNamespaces>
    </>
  );
};

export default Facilities;
