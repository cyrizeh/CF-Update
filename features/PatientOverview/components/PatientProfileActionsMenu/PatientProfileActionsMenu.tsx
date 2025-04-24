import usePatientMutation from '@/api/mutations/usePatientMutation';
import useRole from '@/hooks/useRole';
import useToggleModal from '@/hooks/useToggleModal';
import dots from '@/public/icons/dots-vertical.svg';
import { PatientStatus } from '@/types/Patients.enum';
import { PatientOverviewProps } from '@/types/view';
import { isUserAdmin, isUserGodAdmin, isUserPatient } from '@/utils';
import { handleBackendErrors } from '@/utils/handleBackendErrors';
import { Dropdown } from 'flowbite-react';
import _ from 'lodash';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FaFileInvoiceDollar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import ChangeStoragePlanModal from '../ChangeStoragePlan/ChangeStoragePlanModal';

export const PatientProfileActionsMenu = ({
  patient,
  refetchPatientInfo,
  changeStoragePlanAction,
}: PatientOverviewProps & {
  changeStoragePlanAction?: {
    isEnabledChangeStoragePlan?: boolean;
    storageDuration: string;
    clinicStoragePrices: any[];
    refetchPaymentPlan: any;
  };
}) => {
  const { roles } = useRole();
  const { t } = useTranslation('patients');

  // permissions
  const canChangeStoragePlan =
    changeStoragePlanAction?.isEnabledChangeStoragePlan &&
    patient?.patientStatus === PatientStatus.Created &&
    (isUserAdmin(roles) || isUserGodAdmin(roles) || isUserPatient(roles));

  // USE THIS CHECK TO SHOW NO AVAILABLE ACTIONS
  const showNoAvailableActions = !canChangeStoragePlan;
  // utils
  const {
    isModalOpen: isChangeStoragePlanModalOpen,
    onCloseModal: onChangeStoragePlanCloseModal,
    onOpenModal: onChangeStoragePlanOpenModal,
  } = useToggleModal();

  const { changeStoragePlan } = usePatientMutation(patient.id);

  const handleChangeStoragePlan = async (data: any) => {
    await changeStoragePlan
      .trigger({
        storageDuration: data?.storagePlan,
      })
      .then(() => {
        onChangeStoragePlanCloseModal();
        toast.success('The plan has been changed.');
        changeStoragePlanAction?.refetchPaymentPlan?.();
      })
      .catch((reason: any) => {
        if (reason?.response?.data) {
          if (!_.isEmpty(reason?.response?.data?.errors)) {
            handleBackendErrors(reason?.response?.data?.errors);
          } else if (!_.isEmpty(reason?.response?.data?.detail)) {
            toast.error(reason?.response?.data?.detail);
          } else {
            toast.error('Cannot change storage plan');
          }
        }
      });
  };

  // apis
  const { query } = useRouter();
  return (
    <div className="flex flex-wrap justify-end pt-5">
      <Dropdown
        placement="bottom-end"
        label=""
        dismissOnClick={true}
        renderTrigger={() => (
          <div className="mx-5 flex gap-1 hover:cursor-pointer">
            <span className="text-base text-white">{t('common:actions')}</span>
            <Image src={dots} alt="actions" />
          </div>
        )}>
        <div className="rounded-lg  bg-[#4F4F4F] p-[1px]">
          {canChangeStoragePlan && (
            <Dropdown.Item className="hover:cursor-pointer" onClick={onChangeStoragePlanOpenModal}>
              <FaFileInvoiceDollar />
              <p className="mx-2 text-start">{t('changeStoragePlan.button')}</p>
            </Dropdown.Item>
          )}
          {showNoAvailableActions && (
            <Dropdown.Item className="hover:cursor-pointer">
              <p className="mx-2">{t('noActionsAvailable')}</p>
            </Dropdown.Item>
          )}
        </div>
      </Dropdown>

      <ChangeStoragePlanModal
        isOpen={isChangeStoragePlanModalOpen}
        onClose={onChangeStoragePlanCloseModal}
        storageDuration={changeStoragePlanAction?.storageDuration || ''}
        clinicStoragePrices={changeStoragePlanAction?.clinicStoragePrices || []}
        onSubmit={handleChangeStoragePlan}
      />
    </div>
  );
};
