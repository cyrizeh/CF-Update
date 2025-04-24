import { useEffect, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { PatientsListMobile } from '@/features/Patients/PatientsList/PatientsListMobile';
import { PatientsListTable } from '@/features/Patients/PatientsList/PatientsListTable';
import FilterBadges from '@/components/Filters/FilterBadges';
import FilterDropdown from '@/components/Filters/FilterDropdown';
import TextInput from '@/components/Forms/TextInput/TextInput';
import { useScreenWidth } from '@/hooks';
import { useGetPatients } from '@/api/queries/patient.queries';
import { ApiTypes } from '@/types';
import { HiSearch } from 'react-icons/hi';
import Pagination from '@/components/Pagination/Pagination';
import { useTableControls } from '@/hooks/useTableControls';
import { Button } from 'flowbite-react';
import React from 'react';
import { TbFileImport } from 'react-icons/tb';
import { HiPlus } from 'react-icons/hi';
import useToggleModal from '@/hooks/useToggleModal';
import AddNewPatientModal from '@/features/Patients/CreatePatientModal/CreatePatientModal';
import ImportCSVModal from '@/features/Clinics/ImportCSVModal/importCSV.modal';
import { hasPermission } from '@/utils';
import classNames from 'classnames';
import { convertFilterToString, useFilterAutocompleteOptions } from '@/utils/filterUtils';
import { OnboardingStatusFilter } from '@/constants/filters';
import { usePermissions } from '@/contexts/PermissionsContext/PermissionsContext';

const Patients = () => {
  const { t } = useTranslation('patients');
  const { t: commonT } = useTranslation('common');
  const { isSmallScreen } = useScreenWidth();

  const { userPermissions } = usePermissions();
  const isUserCanCreatePatients = hasPermission(userPermissions, 'create:patients');

  const {
    onOpenModal: onOpenAddNewPatientModal,
    isModalOpen: isAddNewPatientModalOpen,
    onCloseModal: onCloseAddNewPatientModal,
  } = useToggleModal();

  const {
    onOpenModal: onOpenImportPatientCSVModal,
    isModalOpen: isOpenImportPatientCSVModal,
    onCloseModal: onCloseImportPatientCSVModal,
  } = useToggleModal();

  const [patients, setPatients] = useState<null | ApiTypes.PatientsResponse>(null);

  const { filters, pagination, search } = useTableControls(patients, {
    FacilityName: '',
    OnboardingStatus: '',
    ClinicName: '',
    Created: '',
  });

  const {
    data: patientsData,
    isLoading,
    mutate: refetchPatients,
  } = useGetPatients({
    pageSize: pagination.size,
    pageNumber: pagination.currentPage,
    q: search.searchTerm,
    filters: {
      FacilityId: convertFilterToString(filters.actualFilters.facilityId),
      OnboardingStatus: convertFilterToString(filters.actualFilters.OnboardingStatus),
      ClinicId: convertFilterToString(filters.actualFilters.ClinicId),
      PatientType: 'Storage',
      Created: filters.actualFilters.Created || '',
    },
  });

  const [checkedIds, setCheckedIds] = useState<string[]>([]);

  useEffect(() => {
    if (!isLoading && patientsData) {
      setPatients(patientsData);
    }
  }, [patientsData, isLoading]);

  const handleCheck = (id: string) => {
    if (checkedIds.includes(id)) {
      setCheckedIds(checkedIds.filter((id: string) => id !== id));
      return;
    }
    setCheckedIds([...checkedIds, id]);
  };

  const handleAllCheck = () => {
    const patientsIds = patients?.items.map((i, idx) => `${idx}`) || [];

    if (patientsIds.length === checkedIds.length) {
      setCheckedIds([]);
    } else {
      setCheckedIds(patientsIds);
    }
  };
  const clinicsAutocomplete = useFilterAutocompleteOptions('/clinics');
  const facilitiesAutocomplete = useFilterAutocompleteOptions('/facilities');

  const filterConfig = [
    {
      type: 'autocomplete',
      value: 'ClinicId',
      placeholder: 'Clinic Name',
      autocompleteData: clinicsAutocomplete,
    },
    {
      type: 'autocomplete',
      value: 'facilityId',
      autocompleteData: facilitiesAutocomplete,
      placeholder: 'Facility',
    },
    {
      type: 'select',
      value: 'OnboardingStatus',
      placeholder: 'Onboarding Status',
      options: OnboardingStatusFilter,
    },
    { type: 'date', value: 'Created', placeholder: 'Created Date', label: 'Created Date' },
  ];

  return (
    <>
      <h1 className="mb-4 h-14 w-[200px] bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-5xl font-light text-transparent">
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
              full
              adornments={{
                position: 'end',
                content: HiSearch,
              }}
              inputstyles="truncate md:min-w-[250px] sensitive"
              type="text"
              placeholder={t('search_placeholder') as string}
              onChange={search.handleSearch}
            />

            <div className="invisible h-5 border-r border-dark-grey-300 md:visible"></div>

            <FilterDropdown
              {...filters}
              isFiltering={filters.isFiltering}
              state={filters.tempFilters}
              filters={filterConfig}
            />
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 md:mr-4">
          {isUserCanCreatePatients && (
            <Button
              onClick={onOpenAddNewPatientModal}
              className="w-full border-0 md:w-auto"
              size="sm"
              gradientDuoTone="primary">
              <HiPlus className="mr-2 text-lg" />
              {t('add')}
            </Button>
          )}
          <Button color={'outlineOne'} size="sm" className="grow md:grow-0" onClick={onOpenImportPatientCSVModal}>
            <TbFileImport className="mr-2 text-lg" /> {commonT('import_csv')}
          </Button>
        </div>
      </div>

      {filters.isFiltering && (
        <div className="mb-2">
          <FilterBadges filters={filters.actualFilters} removeFilter={filters.removeFilter} config={filterConfig} />
        </div>
      )}

      <div className="rounded-md bg-dark-grey-400 p-4 md:p-8">
        {!isSmallScreen && (
          <PatientsListTable
            patients={patients?.items || []}
            // checkedIds={checkedIds}
            checkedIds={null}
            onCheck={handleCheck}
            onCheckAll={handleAllCheck}
          />
        )}

        {isSmallScreen && <PatientsListMobile patients={patients?.items || []} />}

        {patients?.items.length ? <Pagination {...pagination} /> : null}
        <AddNewPatientModal
          isOpen={isAddNewPatientModalOpen}
          onClose={onCloseAddNewPatientModal}
          refetchPatientData={refetchPatients}
        />
        <ImportCSVModal isOpen={isOpenImportPatientCSVModal} onClose={onCloseImportPatientCSVModal} />
      </div>
    </>
  );
};

export default Patients;
