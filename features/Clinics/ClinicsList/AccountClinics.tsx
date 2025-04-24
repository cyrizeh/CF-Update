import classNames from 'classnames';
import { Spinner } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import { Fragment, useEffect, useState } from 'react';

import FilterBadges from '@/components/Filters/FilterBadges';
import FilterDropdown from '@/components/Filters/FilterDropdown';
import TextInput from '@/components/Forms/TextInput/TextInput';
import Clinic from './Clinic';

import { statesWithId } from '@/constants/states';

import { ApiTypes } from '@/types';

import { HiSearch } from 'react-icons/hi';

import Pagination from '@/components/Pagination/Pagination';

import { useGetAccountById, useGetClinicsByAccountId } from '@/api/queries/account.queries';
import { useGetUsers } from '@/api/queries/user.queries';
import { useTableControls } from '@/hooks/useTableControls';
import { useFilterAutocompleteOptions } from '@/utils/filterUtils';

const AccountClinics = () => {
  const { t } = useTranslation('clinics');

  const [clinics, setClinics] = useState<null | ApiTypes.ClinicsResponse>(null);
  const [loadingClinics, setLoadingClinics] = useState(false);

  const { filters, pagination, search } = useTableControls(clinics, { state: '', parent: '' }, 25);

  const parentAutocomplete = useFilterAutocompleteOptions('/Accounts');
  // prettier-ignore
  // const { onOpenModal: onOpenImportModal, isModalOpen: isOpenImportModal, onCloseModal: onCloseImportModal } = useToggleModal();
  // // prettier-ignore
  // const { onOpenModal: onOpenClinicModal, isModalOpen: isOpenClinicModal, onCloseModal: onCloseClinicModal } = useToggleModal();

  // const { isModalOpen, onCloseModal, onOpenModal } = useToggleModal();

  // const {
  //   data: clinicsData,
  //   isLoading,
  //   mutate,
  // } = useGetClinics({
  //   q: search.searchTerm,
  //   pageSize: pagination.size,
  //   pageNumber: pagination.currentPage,
  //   filters: { state: filters.actualFilters.state, parentCompany: filters.actualFilters.parent },
  // });

  const { data: usersData } = useGetUsers();
  const { data: account } = useGetAccountById(usersData?.accountId as string);
  const {
    data: clinicsData,
    isLoading,
    mutate,
  } = useGetClinicsByAccountId({
    id: usersData?.accountId,
    q: search.searchTerm,
    pageSize: pagination.size,
    pageNumber: pagination.currentPage,
    filters: { state: filters.actualFilters.state, AccountName: filters.actualFilters.parent },
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
  }, [clinicsData, isLoading]);

  const filterConfig = [{ type: 'select', value: 'state', placeholder: 'State', options: statesWithId }];

  return (
    <Fragment>
      {/* <DynamicNamespaces namespaces={['clinics']} fallback="Loading...">
        <CreateParentClinicModal isOpen={isOpenClinicModal} setIsOpen={onCloseClinicModal} />
        <CreateClinicModal
          isOpen={isModalOpen}
          setIsOpen={onCloseModal}
          revalidate={() => mutate(undefined, { revalidate: true })}
        />
      </DynamicNamespaces> */}

      {/* <ImportCSVModal isOpen={isOpenImportModal} onClose={onCloseImportModal} /> */}

      <div className="mb-12 flex flex-col gap-4 text-[40px] font-light leading-[60px] md:flex-row md:items-center">
        <p className="bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-5xl text-transparent md:h-14 ">
          {account?.name}
        </p>
      </div>
      <p className="mb-8 w-48 bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-4xl font-light text-transparent">
        {t('title')}
      </p>
      <div
        className={classNames('flex w-full grid-cols-2 flex-wrap  items-start justify-between', {
          'mb-4': filters.isFiltering,
          'mb-8': !filters.isFiltering,
        })}>
        <div className="mb-4">
          <div className="flex items-center justify-between gap-4 md:mr-4 md:max-w-[500px]">
            <TextInput
              full
              adornments={{
                position: 'end',
                content: HiSearch,
              }}
              inputstyles="truncate ... md:min-w-[250px] sensitive"
              type="text"
              placeholder={'Search by state, city, clinic'}
              onChange={search.handleSearch}
            />

            <div className="h-5 w-1 border-l border-neutral-600" />

            <FilterDropdown
              {...filters}
              isFiltering={filters.isFiltering}
              state={filters.tempFilters}
              filters={filterConfig}
            />
          </div>
        </div>

        {/* <div className="grid w-full grid-cols-2 flex-wrap items-center justify-end gap-4 whitespace-nowrap sm:grid-cols-3 md:max-w-[550px]">
          <Button onClick={onOpenClinicModal} className="border-0" size="sm" gradientDuoTone="primary">
            <HiPlus className="mr-2 text-lg" />
            {t('addParentClinic')}
          </Button>
          <Button onClick={onOpenModal} className="border-0" size="sm" gradientDuoTone="primary">
            <HiPlus className="mr-2 text-lg" />
            {t('addClinic')}
          </Button>

          <Button color={'outlineOne'} size="sm" className="grow md:grow-0" onClick={onOpenImportModal}>
            <TbFileImport className="mr-2 text-lg" />
            {t('common:importCSV')}
          </Button>
        </div> */}
      </div>

      {filters.isFiltering && (
        <div className="mb-4">
          <FilterBadges
            filters={filters.actualFilters}
            removeFilter={filters.removeFilter}
            config={filterConfig}
            autocompleteData={parentAutocomplete}
          />
        </div>
      )}

      <div className="relative grid grid-flow-row grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {loadingClinics && (
          <div className="absolute z-20 flex h-full w-full items-center justify-center rounded-lg	bg-black/10 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2 text-sm text-white">
              <Spinner size="sm" className="mt-[-1px]" /> Loading...
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
        <div className="pt-5 text-center text-sm">No clinics found</div>
      ) : null}

      {clinics?.items.length ? (
        <div className="flex justify-center pb-8">
          <Pagination {...pagination} />
        </div>
      ) : null}
    </Fragment>
  );
};

export default AccountClinics;
