import FilterBadges from '@/components/Filters/FilterBadges';
import FilterDropdown from '@/components/Filters/FilterDropdown';
import TextInput from '@/components/Forms/TextInput/TextInput';
import { billedToFilter, billingStatusFilter, transportationStatusesFilter } from '@/constants/filters';
import { usePermissions } from '@/contexts/PermissionsContext/PermissionsContext';
import { useTransportationContext } from '@/contexts/TransportationContext';
import TransportationModal from '@/features/Patients/TransportationModal/TransportationModal';
import TransportationList from '@/features/Patients/TransportationRequest/TransportationList';
import useToggleModal from '@/hooks/useToggleModal';
import { hasPermission } from '@/utils';
import { useFilterAutocompleteOptions } from '@/utils/filterUtils';
import classNames from 'classnames';
import { Button } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import { HiPlus, HiSearch } from 'react-icons/hi';

const Transportations = () => {
  const { t } = useTranslation('transportation');

  const { userPermissions } = usePermissions();

  const isUserCanAddTransportationPatient = hasPermission(userPermissions, 'create:transportations');

  const { filters, search, mutate } = useTransportationContext();
  const witnessAutocomplete = useFilterAutocompleteOptions('/Witness');

  const filterConfig = [
    {
      type: 'select',
      value: 'BilledTo',
      placeholder: 'Billed to',
      options: billedToFilter,
    },
    {
      type: 'select',
      value: 'BillingStatus',
      placeholder: 'Billing status',
      options: billingStatusFilter,
    },
    {
      type: 'select',
      value: 'TransportationStatus',
      placeholder: 'Transportation Status',
      options: transportationStatusesFilter,
    },
    {
      type: 'autocomplete',
      value: 'Witness',
      autocompleteData: witnessAutocomplete,
      placeholder: 'Witness',
    },
  ];

  const {
    onOpenModal: onOpenTransportationModal,
    isModalOpen: isOpenTransportationModal,
    onCloseModal: onCloseTransportationModal,
  } = useToggleModal();

  return (
    <>
      <h1 className="mb-4 h-14 w-[400px] bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-5xl font-light text-transparent">
        {t('page_title')}
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
              inputstyles="truncate ... md:min-w-[250px] sensitive"
              type="text"
              placeholder={t('search_transportation_placeholder') as string}
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
        {isUserCanAddTransportationPatient && (
          <Button
            className="mb-3 h-[38px] w-full self-center md:mb-0 md:max-w-[198px]"
            size={'xs'}
            gradientDuoTone="primary"
            onClick={onOpenTransportationModal}>
            <HiPlus className="mr-2 text-lg" />
            <div className="text-sm font-medium leading-[150%]">{t('transportation_request')}</div>
          </Button>
        )}
      </div>
      {filters.isFiltering && (
        <div className="mb-2">
          <FilterBadges filters={filters.actualFilters} removeFilter={filters.removeFilter} config={filterConfig} />
        </div>
      )}

      <div className="mb-4 rounded-md bg-dark-grey-400 p-4 md:p-8">
        <TransportationList />
      </div>

      <TransportationModal
        isOpen={isOpenTransportationModal}
        onClose={onCloseTransportationModal}
        refetchTransportationRequests={mutate}
      />
    </>
  );
};

export default Transportations;
