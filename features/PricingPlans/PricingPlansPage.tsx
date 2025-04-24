import { useGetPricingPlans } from '@/api/queries/pricingPlans.queries';
import DataGridTable, { ColDefType } from '@/components/DataGrid/DataGridTable';
import Pagination from '@/components/Pagination/Pagination';
import { buildAdminAddPricingPlanPageRoute, buildAdminPricingPlanDetailsPageRoute } from '@/constants/buildRoutes';
import { useTableControls } from '@/hooks/useTableControls';
import dots from '@/public/icons/dots-vertical.svg';
import PencilAlt from '@/public/icons/PencilAlt';
import { ApiTypes } from '@/types';
import { formatDateWithSlashSeparator } from '@/utils/formatDateWithSlashSeparator';
import { Button, Dropdown } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import EditPricingPlanNameModal from './EditPricingPlanNameModal/EditPricingPlanNameModal';
import _ from 'lodash';
import TextInput from '@/components/Forms/TextInput/TextInput';
import { HiSearch } from 'react-icons/hi';
import classNames from 'classnames';
import { useRouter } from 'next/router';

const PricingPlans: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation('pricingPlans');

  const [openAlert, toggleAlert] = useState(false);
  const [activeId, setActiveId] = useState<{ id: string; name: string }>({ id: '', name: '' });
  const [pricingPlans, setPricingPlans] = useState<null | ApiTypes.PricingPlansListResponse>(null);
  const tableControls = useTableControls(pricingPlans, {});

  const { pagination, search, filters } = tableControls;

  const {
    data: pricingPlansData,
    isLoading,
    mutate: refetchData,
  } = useGetPricingPlans({
    pageSize: pagination.size,
    pageNumber: pagination.currentPage,
    q: search.searchTerm,
  });

  useEffect(() => {
    if (!isLoading && pricingPlansData) {
      setPricingPlans(pricingPlansData);
    }
  }, [pricingPlansData, isLoading]);

  const columns: ColDefType[] = [
    {
      headerName: 'Plan',
      field: 'orderNumber',
      renderHeader: () => <p className="ml-10 w-full">{'Plan'}</p>,
      renderCell: row => (
        <Link href={row.id ? buildAdminPricingPlanDetailsPageRoute(row.id) : ''}>
          <div className="flex max-w-[205px] items-center gap-2 overflow-hidden overflow-ellipsis whitespace-nowrap">
            <Button size={'sm'} gradientDuoTone="primary" className="w-[140px]">
              <span className="w-[130px] truncate text-wrap px-2">{t('view_plan')}</span>
            </Button>
          </div>
        </Link>
      ),
      align: 'left',
    },
    {
      headerName: 'Name',
      field: 'name',
      align: 'left',
      wrapText: true,
    },
    {
      headerName: 'Version',
      field: 'version',
      align: 'left',
    },
    {
      headerName: 'Default Plan',
      field: 'version',
      align: 'left',
      renderCell: row => (_.has(row, 'isDefault') ? (row.isDefault ? 'Yes' : 'No') : 'No'),
    },
    {
      headerName: 'Created date',
      field: 'created',
      align: 'left',
      renderCell: row => (!!row?.created ? formatDateWithSlashSeparator(row?.created) : '-'),
    },
    {
      field: 'action',
      headerName: 'Action',
      align: 'left',
      renderCell: row => (
        <Dropdown
          label=""
          dismissOnClick={false}
          renderTrigger={() => (
            <div className="w-10 hover:cursor-pointer">
              <Image src={dots} alt="actions" />
            </div>
          )}>
          <div className="rounded-lg  bg-[#4F4F4F] p-[1px]">
            <Dropdown.Item
              className="hover:cursor-pointer"
              onClick={() => {
                onOpenAlert(row);
              }}>
              <PencilAlt />
              <p className="hover:bg-blue mx-2">{t('edit_name')}</p>
            </Dropdown.Item>
          </div>
        </Dropdown>
      ),
    },
  ];

  const onOpenAlert = (item: any) => {
    const data = { id: item?.id, name: item?.name };
    setActiveId(data);
    toggleAlert(true);
  };

  const onCloseAlert = () => {
    toggleAlert(false);
    setActiveId({ id: '', name: '' });
  };

  const redirectToCreate = () => router.push(buildAdminAddPricingPlanPageRoute());

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
        <div className="mb-4 flex w-full flex-col items-center justify-between gap-2 md:flex-row">
          <div className="flex w-full items-center justify-between gap-4 md:mr-4 md:max-w-[500px]">
            <TextInput
              full
              adornments={{
                position: 'end',
                content: HiSearch,
              }}
              inputstyles="truncate ... md:min-w-[250px]"
              type="text"
              placeholder={t('search_plans_placeholder') as string}
              onChange={search.handleSearch}
            />
          </div>

          <Button gradientDuoTone="primary" onClick={redirectToCreate} className="w-full md:w-[170px]">
            {t('create')}
          </Button>
        </div>
      </div>

      <div className="mb-4 rounded-md bg-dark-grey-400 p-4 md:p-8">
        <DataGridTable columns={columns} rows={pricingPlans?.items || []} isLoading={isLoading} />
        {pricingPlans?.items?.length ? <Pagination {...pagination} /> : null}
      </div>
      <EditPricingPlanNameModal open={openAlert} onClose={onCloseAlert} plan={activeId} refetchData={refetchData} />
    </>
  );
};

export default PricingPlans;
