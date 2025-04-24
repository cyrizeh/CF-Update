import { Button } from 'flowbite-react';
import classNames from 'classnames';
import TextInput from '@/components/Forms/TextInput/TextInput';
import FilterDropdown from '@/components/Filters/FilterDropdown';
import { HiSearch } from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { useGetDocuments } from '@/api/queries/document.queries';

import Pagination from '@/components/Pagination/Pagination';

import FilterBadges from '@/components/Filters/FilterBadges';
import { useTableControls } from '@/hooks/useTableControls';
import { toast } from 'react-toastify';
import { axiosInstance } from '@/api/axiosConfig';

import DataGridTable, { ColDefType } from '@/components/DataGrid/DataGridTable';

import { TableData, TableLink } from '@/components/DataGrid/TableComponents';

import { FaDownload } from 'react-icons/fa';
import { useScreenWidth } from '@/hooks';
import { DocumentsListMobile } from './DocumentsListMobile/DocumentsListMobile';
import _ from 'lodash';
import { buildAdminGeneralPatientPageRoute } from '@/constants/buildRoutes';
import { documentStatusFilter } from '@/constants/filters';
import { convertFilterToString, useFilterAutocompleteOptions } from '@/utils/filterUtils';
import { DocumentStatus } from '@/types/view';
import useTranslation from 'next-translate/useTranslation';
import { getDocumentStatusTitle } from '@/types/view/DocumentStatus.enum';
import { getOrdinalSuffix } from '@/utils/getOrdinalSuffix';

const Documents = () => {
  const { t } = useTranslation('documents');
  const { isSmallScreen } = useScreenWidth();
  const [documents, setDocuments] = useState<any>(null);
  const [rowSelectionModel, setRowSelectionModel] = useState<Array<string>>([]);
  const [selectedItemsByPage, setSelectedItemsByPage] = useState<{ [key: number]: Array<string> }>({});
  const [currentPage, setCurrentPage] = useState<number>(1);

  const selectedItemsStats = Object.keys(selectedItemsByPage)
    .filter(page => selectedItemsByPage[parseInt(page)].length > 0)
    .map(
      page =>
        `Selected items: ${selectedItemsByPage[parseInt(page)].length} on ${getOrdinalSuffix(parseInt(page))} page`
    )
    .join('; ');

  const totalSelectedItems = rowSelectionModel.length;

  const parentAutocomplete = useFilterAutocompleteOptions('/clinics');

  const { pagination, filters, search, sort } = useTableControls(documents, {
    Status: '',
    CreatedDate: '',
    SignedDate: '',
    ClinicId: '',
  });

  const { data: documentsData, isLoading } = useGetDocuments({
    pageSize: pagination.size,
    pageNumber: pagination.currentPage,
    q: search.searchTerm,
    sort: sort.dataSort,
    filters: {
      Status: convertFilterToString(filters.actualFilters.Status),
      CreatedDate: filters.actualFilters.CreatedDate,
      SignedDate: filters.actualFilters.SignedDate,
      ClinicId: convertFilterToString(filters.actualFilters.ClinicId),
    },
  });

  useEffect(() => {
    if (!isLoading && documentsData) {
      setDocuments(documentsData);
    }
  }, [documentsData, isLoading]);

  const onSelectRow = (id: string) => {
    const updatedSelection = rowSelectionModel.includes(id)
      ? rowSelectionModel.filter(item => item !== id)
      : [...rowSelectionModel, id];
    setRowSelectionModel(updatedSelection);
  };

  const onSelectAll = () => {
    const pageItems = documents?.items?.map((item: any) => item.id) || [];
    const allSelected = selectedItemsByPage[currentPage]?.length === pageItems.length;
    const updatedSelection = allSelected
      ? rowSelectionModel.filter(id => !pageItems.includes(id))
      : [...rowSelectionModel, ...pageItems.filter((id: string) => !rowSelectionModel.includes(id))];
    setRowSelectionModel(updatedSelection);
  };

  useEffect(() => {
    if (documents) {
      const currentPageItemsIds = documents.items.map((item: any) => item.id);
      const updatedSelection = rowSelectionModel.filter(id => currentPageItemsIds.includes(id));
      setSelectedItemsByPage(prev => ({
        ...prev,
        [currentPage]: updatedSelection,
      }));
    }
  }, [currentPage, documents, rowSelectionModel]);

  useEffect(() => {
    setCurrentPage(pagination.currentPage);
  }, [pagination.currentPage]);

  const filterConfig = [
    {
      type: 'select',
      value: 'Status',
      placeholder: 'Status',
      options: documentStatusFilter,
    },
    {
      type: 'autocomplete',
      value: 'ClinicId',
      autocompleteData: parentAutocomplete,
      placeholder: 'Search clinic',
    },

    {
      type: 'date',
      value: 'CreatedDate',
      placeholder: 'Created at',
      label: 'Created at',
    },

    {
      type: 'date',
      value: 'SignedDate',
      placeholder: 'Signed at',
      label: 'Signed at',
    },
  ];

  async function downloadFilesSequentially(urls: any) {
    for (const url of urls) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          const a = document.createElement('a');
          a.href = url;
          a.download = `${name}.pdf`;
          document.body.appendChild(a);
          window.URL.revokeObjectURL(url);
          a.click();
        }
      } catch (error) {
        toast.error('Failed to download file');
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  const handleDownloadList = async () => {
    if (rowSelectionModel.length) {
      try {
        const { data: fileUrls } = await axiosInstance.post(`Documents/Patients/download`, {
          patientDocumentIds: [...rowSelectionModel],
        });

        if (!fileUrls.length) {
          setRowSelectionModel([]);
          return toast.error('Select signed documents');
        }

        if (rowSelectionModel.length > fileUrls.length) {
          toast.error('Only signed documents have been downloaded. You are unable to download unsigned documents.');
        }

        downloadFilesSequentially(fileUrls);
      } catch (err) {
        throw new Error();
      }
    } else {
      toast.error('Select documents');
    }
  };

  const handleClick = async (id: string, name: string, status: string) => {
    if (status === DocumentStatus.NotStarted) {
      const errorMsg = t('notSignedDocumentsErrorMsg');
      return toast.error(errorMsg);
    }

    const { data: fileUrl } = await axiosInstance.post(`Documents/Patients/download`, {
      patientDocumentIds: [id],
    });

    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = `${name}.pdf`;
    document.body.appendChild(a);
    window.URL.revokeObjectURL(fileUrl);
    a.click();
  };

  const openPdfInNewTab = async (id: string, status: string) => {
    if (status !== DocumentStatus.Complete) {
      const errorMsg = t('notSignedDocumentsErrorMsg');
      return toast.error(errorMsg);
    }

    window.open(`/admin/documents/${id}`, '_blank');
  };

  const columns: ColDefType[] = [
    {
      field: 'name',
      headerName: 'Title',
      sortable: true,
      renderCell: row => (
        <div className="cursor-pointer" onClick={() => openPdfInNewTab(row.id, row.status)}>
          {row.name}
        </div>
      ),
    },
    {
      sortable: true,
      field: 'Patient',
      headerName: 'Patient',
      renderCell: row => (
        <TableLink
          styles={{ name: 'sensitive' }}
          href={buildAdminGeneralPatientPageRoute(row.patientId)}
          name={`${row.firstName} ${row.lastName}`}
        />
      ),
    },
    {
      field: 'ClinicName',
      sortable: true,
      headerName: 'Clinic',
      renderCell: row =>
        row.clinicName ? <TableLink href={`/admin/clinics/${row.clinicId}/general`} name={row.clinicName} /> : '-',
      wrapText: true,
    },
    {
      field: 'status',
      headerName: 'Status',
      sortable: true,
      renderCell: row => <div>{getDocumentStatusTitle(row.status)}</div>,
    },
    {
      field: 'signedAt',
      headerName: 'Signed At',
      sortable: true,
      renderCell: row => <TableData date={row.signedAt} />,
    },
    {
      field: 'created',
      sortable: true,
      headerName: 'Created At',
      renderCell: row => <TableData date={row.created} />,
    },
    {
      field: 'action',
      headerName: 'Action',
      align: 'center',
      renderCell: row => (
        <FaDownload className="cursor-pointer" onClick={() => handleClick(row.id, row.name, row.status)} />
      ),
    },
  ];

  return (
    <>
      <h1 className="mb-4 h-14 w-64 bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-5xl font-light text-transparent">
        Documents
      </h1>

      <div
        className={classNames('grid w-full grid-cols-1 items-center justify-between md:flex', {
          'mb-4': filters.isFiltering,
          'mb-8': !filters.isFiltering,
        })}>
        <div className="mb-4 w-full md:mb-0">
          <div className="flex items-center justify-between gap-4 md:mr-4 md:max-w-[500px]">
            <TextInput
              full
              adornments={{
                position: 'end',
                content: HiSearch,
              }}
              inputstyles="truncate md:min-w-[250px] sensitive"
              type="text"
              placeholder="Search by name, clinic, title"
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

        <div className="flex flex-wrap items-center justify-end gap-4">
          <Button
            color={'outlineOne'}
            gradientDuoTone="primary"
            size="sm"
            className="grow md:grow-0"
            onClick={handleDownloadList}>
            Download files
          </Button>
        </div>
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

      <div className="mb-4 min-h-[20px]">
        {
          <div className="dark:br-[#212121] mt-2 flex w-auto flex-nowrap rounded-md bg-[#212121] px-2.5">
            <p className="mr-2 text-xs font-medium leading-[18px] text-gray-300">
              {selectedItemsStats} {totalSelectedItems > 0 && `| Total selected: ${totalSelectedItems}`}
            </p>
          </div>
        }
      </div>

      <div className="rounded-md bg-dark-grey-400 p-4 md:p-8">
        {isSmallScreen ? (
          <DocumentsListMobile documents={documents?.items || []} onSelectRow={onSelectRow} />
        ) : (
          <DataGridTable
            isLoading={isLoading}
            checkboxSelection
            columns={columns}
            rows={documents?.items || []}
            checkedIds={selectedItemsByPage[currentPage] || []}
            onCheck={onSelectRow}
            onCheckAll={onSelectAll}
            sortBy={sort.dataSort}
            changeSort={sort.changeSort}
          />
        )}

        {documents?.items.length ? (
          <div className="flex pt-8">
            <Pagination {...pagination} />
          </div>
        ) : null}
      </div>
    </>
  );
};

export default Documents;
