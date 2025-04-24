import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ClinicPageLayout } from '../index';

import { PatientsListTable } from '@/features/Patients/PatientsList/PatientsListTable';
import { PatientsListMobile } from '@/features/Patients/PatientsList/PatientsListMobile';
import { convertFilterToString, useFilterAutocompleteOptions } from '@/utils/filterUtils';
import { useScreenWidth } from '@/hooks';

import { useGetPatientsByClinic } from '@/api/queries/patient.queries';
import { useTableControls } from '@/hooks/useTableControls';
import { ApiTypes } from '@/types';
import FilterBadges from '@/components/Filters/FilterBadges';
import FilterDropdown from '@/components/Filters/FilterDropdown';
import { OnboardingStatus } from '@/constants/patients';
import TextInput from '@/components/Forms/TextInput/TextInput';
import { HiSearch } from 'react-icons/hi';
import useTranslation from 'next-translate/useTranslation';
import Pagination from '@/components/Pagination/Pagination';

// import { useParamsFilter } from '@/hooks/useParamsFilter';

function ClinicPatients() {
  const router = useRouter();
  const { t } = useTranslation('patients');

  const { isSmallScreen } = useScreenWidth();

  const [checkedIds, setCheckedIds] = useState<string[]>([]);

  const [patients, setPatients] = useState<null | ApiTypes.PatientsResponse>(null);

  const { filters, pagination, search } = useTableControls(patients, {
    FacilityName: '',
    OnboardingStatus: '',
    ClinicName: '',
  });

  const { data: patientsData, isLoading } = useGetPatientsByClinic({
    id: router.query.id as string,
    pageSize: pagination.size,
    pageNumber: pagination.currentPage,
    q: search.searchTerm,
    filters: {
      FacilityId: convertFilterToString(filters.actualFilters.facilityId),
      OnboardingStatus: filters.actualFilters.OnboardingStatus,
      ClinicId: convertFilterToString(filters.actualFilters.ClinicId),
    },
  });

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
  const facilitiesAutocomplete = useFilterAutocompleteOptions('/facilities');

  const filterConfig = [
    {
      type: 'autocomplete',
      value: 'facilityId',
      autocompleteData: facilitiesAutocomplete,
      placeholder: 'Facility',
    },
    {
      type: 'select',
      value: 'OnboardingStatus',
      placeholder: 'Onboarding status',
      options: OnboardingStatus,
    },
  ];

  return (
    <div className="mb-4 rounded-md bg-dark-grey-400 p-4 md:p-8">
      {/* <div className="mb-4 w-48 bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-4xl font-light text-transparent">
        Patients
      </div> */}

      <div className="table-header mb-4 flex flex-wrap items-center md:mb-4">
        <div className="mr-0 flex w-full items-center gap-4 md:mr-4 md:basis-2/5">
          <TextInput
            full
            adornments={{
              position: 'end',
              content: HiSearch,
            }}
            inputstyles="truncate ... md:min-w-[250px] sensitive"
            type="text"
            placeholder={t('search_clinic_patients_placeholder')}
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

      <div className="mb-4">
        <FilterBadges filters={filters.actualFilters} removeFilter={filters.removeFilter} config={filterConfig} />
      </div>

      {!isSmallScreen && (
        <PatientsListTable
          patients={patients?.items || []}
          checkedIds={null}
          onCheck={handleCheck}
          onCheckAll={handleAllCheck}
        />
      )}
      {isSmallScreen && <PatientsListMobile patients={patients?.items || []} />}

      {patients?.items.length ? <Pagination {...pagination} /> : null}
    </div>
  );
}

ClinicPatients.getLayout = ClinicPageLayout;

export default ClinicPatients;
