import { useEffect, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { PatientsListMobile } from '@/features/Patients/PatientsList/PatientsListMobile';
import { PatientsListTable } from '@/features/Patients/PatientsList/PatientsListTable';
import FilterBadges from '@/components/Filters/FilterBadges';
import FilterDropdown from '@/components/Filters/FilterDropdown';
import TextInput from '@/components/Forms/TextInput/TextInput';
import { useScreenWidth } from '@/hooks';
import { ApiTypes } from '@/types';
import { HiPlus, HiSearch } from 'react-icons/hi';
import Pagination from '@/components/Pagination/Pagination';
import { useTableControls } from '@/hooks/useTableControls';
import { useGetClinicById, useGetClinicsPatients } from '@/api/queries/clinic.queries';
import { Button } from 'flowbite-react';
import { hasPermission } from '@/utils';
import useToggleModal from '@/hooks/useToggleModal';
import AddNewPatientModal from '../CreatePatientModal/CreatePatientModal';
import { useGetUsers } from '@/api/queries/user.queries';
import { convertFilterToString } from '@/utils/filterUtils';
import { OnboardingStatusFilter } from '@/constants/filters';
import { usePermissions } from '@/contexts/PermissionsContext/PermissionsContext';

const ClinicsPatients = () => {
  const { data: usersData } = useGetUsers();
  const { data: clinic } = useGetClinicById(usersData?.clinicId as string);
  const { t } = useTranslation('patients');
  const { isSmallScreen } = useScreenWidth();
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
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
    mutate,
  } = useGetClinicsPatients({
    id: usersData?.clinicId,
    pageSize: pagination.size,
    pageNumber: pagination.currentPage,
    q: search.searchTerm,
    filters: {
      OnboardingStatus: convertFilterToString(filters.actualFilters.OnboardingStatus),
      Created: filters.actualFilters.Created || '',
    },
  });

  const { data: clinicData } = useGetClinicById(usersData?.clinicId);

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

  const filterConfig = [
    {
      type: 'select',
      value: 'OnboardingStatus',
      placeholder: 'Onboarding Status',
      options: OnboardingStatusFilter,
    },
    { type: 'date', value: 'Created', placeholder: 'Created Date', label: 'Created Date' },
  ];
  const { userPermissions } = usePermissions();
  const isUserCanCreatePatients = hasPermission(userPermissions, 'create:patients');
  const { isModalOpen, onCloseModal, onOpenModal } = useToggleModal();

  return (
    <>
      <div className="flex flex-col gap-8">
        <div className="mb-4 flex flex-col gap-4 text-[40px] font-light leading-[60px] md:flex-row md:items-center">
          <p className="bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text pb-2 text-5xl text-transparent">
            {clinic?.name}
          </p>
        </div>
        <p className="mb-0 w-48 bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-4xl font-light text-transparent">
          {t('title')}
        </p>
        <div className="flex items-center justify-between">
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

          {isUserCanCreatePatients && (
            <Button onClick={onOpenModal} className="border-0" size="sm" gradientDuoTone="primary">
              <HiPlus className="mr-2 text-lg" />
              {'Add patient'}
            </Button>
          )}
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
              checkedIds={null}
              onCheck={handleCheck}
              onCheckAll={handleAllCheck}
              userRole={usersData?.role}
              isLoading={isLoading}
            />
          )}

          {isSmallScreen && <PatientsListMobile patients={patients?.items || []} userRole={usersData?.role} />}

          {patients?.items.length ? <Pagination {...pagination} /> : null}
          {
            <AddNewPatientModal
              isOpen={isModalOpen}
              onClose={onCloseModal}
              clinicData={clinicData}
              refetchPatientData={mutate}
            />
          }
        </div>
      </div>
    </>
  );
};

export default ClinicsPatients;
