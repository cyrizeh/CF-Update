import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';

import usePatientMutation from '@/api/mutations/usePatientMutation';
import { useGetPatientBillingByCycle } from '@/api/queries/patient.queries';
import DataGridTable, { ColDefType } from '@/components/DataGrid/DataGridTable';
import { buildAdminGeneralPatientPageRoute } from '@/constants/buildRoutes';
import useToggleModal from '@/hooks/useToggleModal';
import PlusIcon from '@/public/icons/PlusIcon';
import { ApiTypes } from '@/types';
import { PatientSubscriptionType } from '@/types/api/Responses/PatientResponse.type';
import { handleBackendErrors } from '@/utils/handleBackendErrors';
import { Button, Spinner } from 'flowbite-react';
import { useRouter } from 'next/router';
import { MdDelete } from 'react-icons/md';
import BillingByCycleModal from './BillingByCycleModal';
import { getSpecimenLabels } from '@/utils/getSpecimenLabels';
import ConfirmationModal from '@/components/ConfirmationModal/ConfirmationModal';
import { formatDateWithSlashSeparator } from '@/utils/formatDateWithSlashSeparator';

const BillingByCycle = ({ patient }: { patient: any }) => {
  const router = useRouter();
  const { t } = useTranslation('patients');

  const [billingList, setBillingList] = useState<null | ApiTypes.PatientBillingByCycleItem[]>(null);
  const [openAlert, toggleAlert] = useState(false);
  const [activeId, setActiveId] = useState('');

  const { isModalOpen, onCloseModal, onOpenModal } = useToggleModal();
  const {
    data: billingsData,
    isLoading,
    mutate,
  } = useGetPatientBillingByCycle({
    patientId: patient?.id as string,
  });

  useEffect(() => {
    if (!isLoading && billingsData) {
      setBillingList(billingsData);
    }
  }, [isLoading, billingsData]);

  const columns: ColDefType[] = [
    {
      headerName: t('billingByCycle.status'),
      field: 'status',
    },
    {
      headerName: t('billingByCycle.billingDate'),
      field: 'billingDate',
      renderCell: row => (!!row?.billingDate ? formatDateWithSlashSeparator(row?.billingDate) : '-'),
    },
    {
      headerName: t('billingByCycle.specimenTypes'),
      field: 'tissueType',
      renderCell: (row: { specimenTypes: any[] }) =>
        row.specimenTypes?.length ? getSpecimenLabels(row.specimenTypes) : '-',
      wrapText: true,
    },
    {
      field: 'action',
      headerName: 'Delete',
      renderCell: row => <MdDelete className="cursor-pointer" onClick={() => onOpenAlert(row.id)} />,
    },
  ];

  const onOpenAlert = (id: string) => {
    setActiveId(id);
    toggleAlert(true);
  };

  const onCloseAlert = () => {
    toggleAlert(false);
    setActiveId('');
  };

  const { deleteBillingCycle } = usePatientMutation(patient?.id as string);

  const onDeleteCane = () => {
    deleteBillingCycle
      .trigger({ id: activeId })
      .then(() => {
        // @ts-ignore
        mutate(undefined, { revalidate: true });
      })
      .catch(reason => {
        if (reason?.response?.data?.errors) {
          handleBackendErrors(reason.response.data.errors);
        }
      })
      .finally(() => {
        onCloseAlert();
      });
  };

  if (patient && patient?.subscriptionType !== PatientSubscriptionType.PerCycle) {
    router.push(buildAdminGeneralPatientPageRoute(patient?.id));
  }

  if (isLoading) {
    return (
      <div className="text-center">
        <Spinner />
      </div>
    );
  }

  return patient && patient?.subscriptionType === PatientSubscriptionType.PerCycle ? (
    <>
      <div className="flex justify-end">
        <Button gradientDuoTone="primary" onClick={onOpenModal}>
          <div className="mr-2">
            <PlusIcon />
          </div>
          {t('billingByCycle.addCycle')}
        </Button>
      </div>
      <div className="mb-4 rounded-md bg-dark-grey-400 p-4 md:p-8">
        <DataGridTable columns={columns} rows={billingList || []} isLoading={isLoading} />
      </div>
      <BillingByCycleModal isOpen={isModalOpen} onClose={onCloseModal} refetchTableData={mutate} />
      <ConfirmationModal
        isOpen={openAlert}
        onClose={onCloseAlert}
        onConfirm={onDeleteCane}
        isLoading={deleteBillingCycle?.isMutating}
        title={t('common:delete')}
        message={t('common:deleteConfirmation')}
      />
    </>
  ) : patient && patient?.subscriptionType !== PatientSubscriptionType.PerCycle ? (
    <div className="mb-4 rounded-md bg-dark-grey-400 p-4 md:p-8">
      <p className="text-center text-white">{t('billingByCycle.subscriptionError')}</p>
    </div>
  ) : null;
};

export default BillingByCycle;
