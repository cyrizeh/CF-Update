import usePatientMutation from '@/api/mutations/usePatientMutation';
import useToggleModal from '@/hooks/useToggleModal';
import { PatientOverviewProps } from '@/types/view';
import { handleBackendErrors } from '@/utils/handleBackendErrors';
import { Button, Spinner } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { useState } from 'react';
import PatientComponentLayout from '../PatientComponentLayout';
import LinkedAccModal from './LinkedAccModal';
import useRole from '@/hooks/useRole';
import { isUserAdmin, isUserGodAdmin } from '@/utils';
import { LinkedAccountPartnerInfo } from './LinkedAccountPartnerInfo';
import { PatientStatus } from '@/types/Patients.enum';
import ConfirmationModal from '@/components/ConfirmationModal/ConfirmationModal';

const LinkedAcc = ({ patient, refetchPatientInfo }: PatientOverviewProps) => {
  const { t } = useTranslation('patients');
  const { query } = useRouter();
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const { roles } = useRole();
  const isCryoAdmin = isUserAdmin(roles) || isUserGodAdmin(roles);
  const canUserAddDeletePartner = isCryoAdmin;

  const { deleteLinkedAcc } = usePatientMutation(query.id as string);
  const {
    isModalOpen: isDeleteItemOpen,
    onCloseModal: onCloseDeleteItem,
    onOpenModal: onOpenDeleteItem,
  } = useToggleModal();

  const {
    isModalOpen: isCreateItemOpen,
    onCloseModal: onCloseCreateItem,
    onOpenModal: onOpenCreateItem,
  } = useToggleModal();

  const accounts = patient?.partner && [
    {
      name: `${patient.partner?.firstName} ${patient.partner?.lastName}`,
      partnerId: patient.partner?.id,
      address: patient.partner?.address?.city,
      isTheSameClinicWithPatient: patient?.isTheSameClinicWithPatient,
      clinicName: patient?.partnerClinicName,
    },
  ];

  const onDeleteLinkedAcc = () => {
    deleteLinkedAcc
      .trigger({ partnerId: selectedPartnerId || '', patientId: patient?.id })
      .then(() => {
        refetchPatientInfo?.(undefined, { revalidate: true });
      })
      .catch(reason => {
        if (reason?.response?.data?.errors) {
          handleBackendErrors(reason.response.data.errors);
        }
      })
      .finally(() => onCloseDeleteItem());
  };

  return (
    <PatientComponentLayout col>
      <ConfirmationModal
        isOpen={isDeleteItemOpen}
        onClose={onCloseDeleteItem}
        onConfirm={onDeleteLinkedAcc}
        title={t('linkedAcc.deleteLinkedAcc')}
        isLoading={deleteLinkedAcc?.isMutating}>
        {
          <div className="flex w-full flex-col text-[20px] font-normal leading-[21px] text-gray-50">
            <p className="text-start font-['Inter'] text-lg font-light text-white">
              <span className="font-semibold">{t('linkedAcc.warning')}</span>
              <span>{t('linkedAcc.warningMsg')}</span>
            </p>
          </div>
        }
      </ConfirmationModal>
      <LinkedAccModal isOpen={isCreateItemOpen} onClose={onCloseCreateItem} refetchPatientData={refetchPatientInfo} />
      <div className="flex justify-between">
        <span className="mb-6 text-2xl font-normal text-white">Linked Accounts</span>
        {!accounts?.length && canUserAddDeletePartner && (
          <Button
            gradientDuoTone="primary"
            onClick={() => {
              onOpenCreateItem();
            }}
            disabled={deleteLinkedAcc?.isMutating}>
            {t('linkedAcc.addLinkedAcc')}
          </Button>
        )}
      </div>
      {accounts?.map((item, i) => (
        <div key={i} className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-start flex flex-col gap-1 text-left">
              <LinkedAccountPartnerInfo
                partnerId={item?.partnerId}
                name={item?.name}
                isTheSameClinic={item?.isTheSameClinicWithPatient || false}
              />
            </div>
            {canUserAddDeletePartner && (
              <Button
                gradientDuoTone="primary"
                onClick={() => {
                  setSelectedPartnerId(item.partnerId);
                  onOpenDeleteItem();
                }}
                disabled={deleteLinkedAcc?.isMutating}>
                {deleteLinkedAcc?.isMutating ? (
                  <div className="flex items-center gap-2">
                    <Spinner size="sm" className="mt-[-1px]" /> Loading...
                  </div>
                ) : (
                  t('linkedAcc.deleteLinkedAcc')
                )}
              </Button>
            )}
          </div>

          {item.address && (
            <div className="flex flex-wrap justify-between gap-3">
              <span className="text-sm font-normal text-gray-300">{`${t('linkedAcc.address')}:`}</span>
              <span className="text-sm font-normal text-gray-300">{item.address}</span>
            </div>
          )}
          {item.clinicName && (
            <div className="flex flex-wrap justify-between gap-3">
              <span className="text-sm font-normal text-gray-300">{`${t('linkedAcc.clinicName')}:`}</span>
              <span className="text-sm font-normal text-gray-300">{item.clinicName}</span>
            </div>
          )}
          {i !== accounts.length - 1 && (
            <hr className="my-4 h-0.5 rounded border-0 bg-[#4F4F4F] dark:bg-[#4F4F4F]"></hr>
          )}
        </div>
      ))}
    </PatientComponentLayout>
  );
};

export default LinkedAcc;
