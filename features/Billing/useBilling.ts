import { useGetBillingInfo } from '@/api/queries/billing.queries';
import { billingStatusListFilter } from '@/constants/filters';
import { useTableControls } from '@/hooks/useTableControls';
import { ApiTypes } from '@/types';
import { convertFilterToString, useFilterAutocompleteOptions } from '@/utils/filterUtils';
import { getOrdinalSuffix } from '@/utils/getOrdinalSuffix';
import { useEffect, useState } from 'react';

const useBilling = () => {
  // states
  const [billingsList, setBillingsList] = useState<ApiTypes.BillingResponse>();
  const [selectedItemsByPage, setSelectedItemsByPage] = useState<{ [key: number]: Array<string> }>({});
  const [rowSelectionModel, setRowSelectionModel] = useState<Array<string>>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const selectedItemsStats = Object.keys(selectedItemsByPage)
    .filter(page => selectedItemsByPage[parseInt(page)].length > 0)
    .map(
      page =>
        `Selected items: ${selectedItemsByPage[parseInt(page)].length} on ${getOrdinalSuffix(parseInt(page))} page`
    )
    .join('; ');

  const totalSelectedItems = rowSelectionModel.length;

  // table
  const { filters, search, pagination } = useTableControls(billingsList, {
    patientId: '',
    clinicId: '',
    facilityId: '',
    name: '',
    status: '',
    dueDate: '',
    paymentDateFrom: '',
    paymentDateTo: '',
  });

  // apies
  const { data: billingData, isLoading: isBillingLoading } = useGetBillingInfo({
    pageSize: pagination.size,
    pageNumber: pagination.currentPage,
    q: search.searchTerm,
    filters: {
      PatientId: convertFilterToString(filters.actualFilters.patientId),
      ClinicId: convertFilterToString(filters.actualFilters.clinicId),
      FacilityId: convertFilterToString(filters.actualFilters.facilityId),
      Name: filters.actualFilters.name || '',
      Status: convertFilterToString(filters.actualFilters.status) || '',
      DueDate: filters.actualFilters.dueDate || '',
      PaymentDateFrom: filters.actualFilters.paymentDateFrom || '',
      PaymentDateTo: filters.actualFilters.paymentDateTo || '',
    },
  });

  // functions
  const onSelectRow = (id: string) => {
    const updatedSelection = rowSelectionModel.includes(id)
      ? rowSelectionModel.filter(item => item !== id)
      : [...rowSelectionModel, id];
    setRowSelectionModel(updatedSelection);
  };

  const onSelectAll = () => {
    const pageItems = billingData?.items?.map((item: any) => item.id) || [];
    const allSelected = selectedItemsByPage[currentPage]?.length === pageItems.length;
    const updatedSelection = allSelected
      ? rowSelectionModel.filter(id => !pageItems.includes(id))
      : [...rowSelectionModel, ...pageItems.filter((id: string) => !rowSelectionModel.includes(id))];
    setRowSelectionModel(updatedSelection);
  };

  // effects
  useEffect(() => {
    if (!isBillingLoading && billingData) {
      setBillingsList(billingData);
    }
  }, [billingData, isBillingLoading]);

  useEffect(() => {
    if (billingData) {
      const currentPageItemsIds = billingData.items.map((item: any) => item.id);
      const updatedSelection = rowSelectionModel.filter(id => currentPageItemsIds.includes(id));
      setSelectedItemsByPage(prev => ({
        ...prev,
        [currentPage]: updatedSelection,
      }));
    }
  }, [currentPage, billingData, rowSelectionModel]);

  useEffect(() => {
    setCurrentPage(pagination.currentPage);
  }, [pagination.currentPage]);

  // autocomplete
  const patientsAutocomplete = useFilterAutocompleteOptions('/admin/patients', undefined, 'firstAndLast');
  const clinicsAutocomplete = useFilterAutocompleteOptions('/clinics');
  const facilitiesAutocomplete = useFilterAutocompleteOptions('/facilities');

  const filterConfig = [
    {
      type: 'autocomplete',
      value: 'patientId',
      autocompleteData: patientsAutocomplete,
      placeholder: 'Patient',
    },
    {
      type: 'autocomplete',
      value: 'clinicId',
      autocompleteData: clinicsAutocomplete,
      placeholder: 'Clinic',
    },
    {
      type: 'autocomplete',
      value: 'facilityId',
      autocompleteData: facilitiesAutocomplete,
      placeholder: 'Facility',
    },
    {
      type: 'text',
      value: 'name',
      placeholder: 'Charge name',
    },
    {
      type: 'select',
      value: 'status',
      placeholder: 'Status',
      options: billingStatusListFilter,
    },
    { type: 'date', value: 'dueDate', placeholder: 'Due Date', label: 'Due Date' },
    { type: 'date', value: 'paymentDateFrom', placeholder: 'Payment Date From', label: 'Payment Date From' },
    { type: 'date', value: 'paymentDateTo', placeholder: 'Payment Date To', label: 'Payment Date To' },
  ];

  return {
    filters,
    pagination,
    search,
    billingsList,
    filterConfig,
    isBillingLoading,
    selectedItemsByPage,
    rowSelectionModel,
    currentPage,
    selectedItemsStats,
    totalSelectedItems,
    onSelectRow,
    onSelectAll,
  };
};

export default useBilling;
