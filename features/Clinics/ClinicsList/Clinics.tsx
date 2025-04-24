import classNames from 'classnames';
import useTranslation from 'next-translate/useTranslation';
import { Fragment, useEffect, useState } from 'react';
import { Button, Spinner } from 'flowbite-react';

import Clinic from './Clinic';
import CreateClinicModal from '../CreateClinicModal/CreateClinicModal';
import ImportCSVModal from '../ImportCSVModal/importCSV.modal';
import FilterBadges from '@/components/Filters/FilterBadges';
import FilterDropdown from '@/components/Filters/FilterDropdown';
import TextInput from '@/components/Forms/TextInput/TextInput';

import { statesWithId } from '@/constants/states';

import useToggleModal from '@/hooks/useToggleModal';

import { useGetClinics } from '@/api/queries/clinic.queries';

import { ApiTypes } from '@/types';

import { TbFileImport } from 'react-icons/tb';
import { HiPlus, HiSearch } from 'react-icons/hi';

import CreateParentClinicModal from '../CreateParentClinicModal/CreateParentClinicModal';
import Pagination from '@/components/Pagination/Pagination';

import DynamicNamespaces from 'next-translate/DynamicNamespaces';
import { useTableControls } from '@/hooks/useTableControls';
import { useGetUsers } from '@/api/queries/user.queries';
import { convertFilterToString, useFilterAutocompleteOptions } from '@/utils/filterUtils';

const Clinics = () => {
  const { t } = useTranslation('clinics');

  const [clinics, setClinics] = useState<null | ApiTypes.ClinicsResponse>(null);
  const [loadingClinics, setLoadingClinics] = useState(false);
  const { data: usersData } = useGetUsers();

  const { filters, pagination, search } = useTableControls(clinics, { state: '', parent: '' }, 25);

  const parentAutocomplete = useFilterAutocompleteOptions('/Accounts');
  // prettier-ignore
  const { onOpenModal: onOpenImportModal, isModalOpen: isOpenImportModal, onCloseModal: onCloseImportModal } = useToggleModal();
  // prettier-ignore
  const { onOpenModal: onOpenClinicModal, isModalOpen: isOpenClinicModal, onCloseModal: onCloseClinicModal } = useToggleModal();

  const { isModalOpen, onCloseModal, onOpenModal } = useToggleModal();

  const {
    data: clinicsData,
    isLoading,
    mutate,
  } = useGetClinics({
    q: search.searchTerm,
    pageSize: pagination.size,
    pageNumber: pagination.currentPage,
    filters: {
      state: convertFilterToString(filters.actualFilters.state),
      AccountId: convertFilterToString(filters.actualFilters.parent),
    },
  });

  useEffect(() => {
    if (isLoading) {
      setLoadingClinics(true);
    }
    if (!isLoading && clinicsData) {
      setTimeout(() => {
        setClinics(clinicsData);
        setLoadingClinics(false);
      }, 500);
    }
  }, [clinicsData, isLoading, mutate]);

  const filterConfig = [
    { type: 'select', value: 'state', placeholder: 'State', options: statesWithId },
    {
      type: 'autocomplete',
      value: 'parent',
      autocompleteData: parentAutocomplete,
      placeholder: 'Search account',
    },
  ];

  return (
    <Fragment>
      <DynamicNamespaces namespaces={['clinics']}>
        <CreateParentClinicModal isOpen={isOpenClinicModal} setIsOpen={onCloseClinicModal} />
        <CreateClinicModal
          isOpen={isModalOpen}
          setIsOpen={onCloseModal}
          revalidate={() => mutate(undefined, { revalidate: true })}
        />
      </DynamicNamespaces>

      <ImportCSVModal isOpen={isOpenImportModal} onClose={onCloseImportModal} />

      <h1
        data-testid="page-title"
        className="mb-8 h-14 w-48 bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-5xl font-light text-transparent">
        {t('title')}
      </h1>

      <div
        className={classNames('flex w-full grid-cols-2 flex-wrap  items-start justify-between', {
          'mb-4': filters.isFiltering,
          'mb-8': !filters.isFiltering,
        })}>
        <div className="mb-4">
          <div className="flex items-center justify-between gap-4 md:mr-4 md:max-w-[500px]">
            <TextInput
              data-testid="search-input"
              full
              adornments={{
                position: 'end',
                content: HiSearch,
              }}
              inputstyles="truncate ... md:min-w-[250px]"
              type="text"
              placeholder={t('searchPlaceholder')}
              onChange={search.handleSearch}
            />

            <div data-testid="divider" className="h-5 w-1 border-l border-neutral-600" />

            <FilterDropdown
              {...filters}
              isFiltering={filters.isFiltering}
              state={filters.tempFilters}
              filters={filterConfig}
            />
          </div>
        </div>

        <div
          data-testid="action-buttons-container"
          className="grid w-full grid-cols-2 flex-wrap items-center justify-end gap-4 whitespace-nowrap sm:grid-cols-3 md:max-w-[550px]">
          <Button
            data-testid="add-parent-clinic-button"
            onClick={onOpenClinicModal}
            className="border-0"
            size="sm"
            gradientDuoTone="primary">
            <HiPlus className="mr-2 text-lg" />
            {t('addParentClinic')}
          </Button>
          <Button
            data-testid="add-clinic-button"
            onClick={onOpenModal}
            className="border-0"
            size="sm"
            gradientDuoTone="primary">
            <HiPlus className="mr-2 text-lg" />
            {t('addClinic')}
          </Button>

          <Button
            data-testid="import-csv-button"
            color={'outlineOne'}
            size="sm"
            className="grow md:grow-0"
            onClick={onOpenImportModal}>
            <TbFileImport className="mr-2 text-lg" />
            {t('common:importCSV')}
          </Button>
        </div>
      </div>

      {filters.isFiltering && (
        <div data-testid="filter-badges-container" className="mb-4">
          <FilterBadges
            filters={filters.actualFilters}
            removeFilter={filters.removeFilter}
            config={filterConfig}
            autocompleteData={parentAutocomplete}
          />
        </div>
      )}

      <div
        data-testid="clinics-list-container"
        className="relative grid grid-flow-row grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {loadingClinics && (
          <div
            data-testid="loading-indicator"
            className="absolute inset-0 z-20 flex items-center justify-center rounded-lg bg-black/10 backdrop-blur-sm md:mt-60">
            <div className="flex items-center justify-center gap-2 text-sm text-white">
              <Spinner size="sm" className="mt-[-1px]" /> {t('common:loadingWithDots')}
            </div>
          </div>
        )}

        {clinics?.items.length
          ? clinics.items?.map((clinic, index) => (
              <Clinic key={index} clinic={clinic} updateClinics={mutate} userRole={usersData?.role} />
            ))
          : null}
      </div>

      {clinics?.items.length === 0 && !loadingClinics ? (
        <div data-testid="no-clinics-message" className="pt-5 text-center text-sm">
          No clinics found
        </div>
      ) : null}

      {clinics?.items.length ? (
        <div data-testid="pagination-container" className="flex justify-center pb-8">
          <Pagination {...pagination} />
        </div>
      ) : null}
    </Fragment>
  );
};

export default Clinics;
