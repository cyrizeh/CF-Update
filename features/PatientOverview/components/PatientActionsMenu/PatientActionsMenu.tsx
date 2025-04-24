import usePatientMutation from '@/api/mutations/usePatientMutation';
import ConfirmationModal from '@/components/ConfirmationModal/ConfirmationModal';
import useRole from '@/hooks/useRole';
import useToggleModal from '@/hooks/useToggleModal';
import dots from '@/public/icons/dots-vertical.svg';
import { PatientStatus } from '@/types/Patients.enum';
import { PatientOverviewProps } from '@/types/view';
import { OnboardingType } from '@/types/view/OnBoardingType.type';
import { PatientAccountStatus } from '@/types/view/PatientOverviewProps.interface';
import { isUserAdmin, isUserGodAdmin, isUserPatient } from '@/utils';
import { handleBackendErrors } from '@/utils/handleBackendErrors';
import { Divider } from '@mui/material';
import { Dropdown } from 'flowbite-react';
import _ from 'lodash';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FaArrowsRotate, FaClipboardList, FaCopy, FaFileInvoiceDollar, FaRotateLeft } from 'react-icons/fa6';
import { toast } from 'react-toastify';
import ChangeStoragePlanModal from '../ChangeStoragePlan/ChangeStoragePlanModal';
import CreatePatientAccountModal from '../CreatePatientAccount/CreatePatientAccountModal';

export const PatientActionsMenu = ({
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
  const isCreateAccountEnabled = isUserAdmin(roles) || isUserGodAdmin(roles);
  const isResendInviteEnabled = isUserAdmin(roles) || isUserGodAdmin(roles);
  const isOnboardingTypeNoLoginOrJustLogin = [
    OnboardingType.NoLoginOnboarding,
    OnboardingType.JustPatientLogin,
  ].includes(patient?.onboardingType as OnboardingType);
  const canInitiateOnboarding =
    isCreateAccountEnabled && isOnboardingTypeNoLoginOrJustLogin && patient?.patientStatus === PatientStatus.Created;
  const canResendInvite = isResendInviteEnabled && patient?.accountStatus === PatientAccountStatus.Active;
  const canResetOnboarding =
    patient?.patientStatus === PatientStatus.Created && !isOnboardingTypeNoLoginOrJustLogin && !isUserPatient(roles);
  const canCopyUserId = isUserAdmin(roles) || isUserGodAdmin(roles);
  const canChangeStoragePlan =
    changeStoragePlanAction?.isEnabledChangeStoragePlan &&
    patient?.patientStatus === PatientStatus.Created &&
    (isUserAdmin(roles) || isUserGodAdmin(roles) || isUserPatient(roles));
  // USE THIS CHECK TO SHOW NO AVAILABLE ACTIONS
  const showNoAvailableActions =
    !canResendInvite && !canResetOnboarding && !canInitiateOnboarding && !canCopyUserId && !canChangeStoragePlan;
  // utils
  const { isModalOpen, onCloseModal, onOpenModal } = useToggleModal();
  const {
    isModalOpen: isResetOnboardingModalOpen,
    onCloseModal: onResetOnboardingCloseModal,
    onOpenModal: onResetOnboardingOpenModal,
  } = useToggleModal();
  const {
    isModalOpen: isResendInviteModalOpen,
    onCloseModal: onResendInviteCloseModal,
    onOpenModal: onResendInviteOpenModal,
  } = useToggleModal();
  const {
    isModalOpen: isChangeStoragePlanModalOpen,
    onCloseModal: onChangeStoragePlanCloseModal,
    onOpenModal: onChangeStoragePlanOpenModal,
  } = useToggleModal();
  // fns
  const { resendInvite } = usePatientMutation(patient?.id);
  // resend Invite
  const handleResendInvite = () => {
    resendInvite
      ?.trigger()
      .then(() => {
        toast.success('The email has been sent.');
        onResendInviteCloseModal();
      })
      .catch(reason => {
        if (reason?.response?.data?.errors) {
          handleBackendErrors(reason.response.data.errors);
        }
      });
  };

  // reset onboarding
  const onResetOnboarding = () => {
    resetOnboarding
      .trigger({ patientId: patient?.id })
      .then(() => {
        toast.success('The onboarding has been successfully reset.');
        refetchPatientInfo?.(undefined, { revalidate: true });
        onResetOnboardingCloseModal();
      })
      .catch(reason => {
        if (reason?.response?.data?.errors) {
          handleBackendErrors(reason.response.data.errors);
        }
      });
  };

  // copy user id
  const copyUserId = () => {
    if (!patient?.userId) {
      toast.error('User ID not available');
      return;
    }
    navigator.clipboard.writeText(patient?.userId as string);
    toast.success('User ID copied to clipboard');
  };

  const { changeStoragePlanByAdmin } = usePatientMutation(patient.id);

  // change storage plan
  const handleChangeStoragePlan = async (data: any) => {
    await changeStoragePlanByAdmin
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
  const { resetOnboarding } = usePatientMutation(query.id as string);
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
          {canResendInvite && (
            <Dropdown.Item className="hover:cursor-pointer" onClick={onResendInviteOpenModal}>
              <FaRotateLeft />
              <p className="mx-2">{patient?.hasLoggedIn ? t('resetPassword') : t('resendInvite')}</p>
            </Dropdown.Item>
          )}
          {canInitiateOnboarding && (
            <Dropdown.Item className="hover:cursor-pointer" onClick={onOpenModal}>
              <FaClipboardList />
              <p className="mx-2">{t('initiateOnboarding')}</p>
            </Dropdown.Item>
          )}
          {canResetOnboarding && (
            <Dropdown.Item className="hover:cursor-pointer" onClick={onResetOnboardingOpenModal}>
              <FaArrowsRotate />
              <p className="mx-2">{t('resetOnboarding')}</p>
            </Dropdown.Item>
          )}
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
          <Divider className="bg-dark-grey-500" />
          {canCopyUserId && (
            <Dropdown.Item className="hover:cursor-pointer" onClick={copyUserId}>
              <FaCopy />
              <p className="mx-2">{t('Copy User ID')}</p>
            </Dropdown.Item>
          )}
        </div>
      </Dropdown>
      <CreatePatientAccountModal
        isOpen={isModalOpen}
        onClose={onCloseModal}
        refetchPatientData={refetchPatientInfo}
        patient={patient}
      />
      <ConfirmationModal
        isOpen={isResetOnboardingModalOpen}
        onClose={onResetOnboardingCloseModal}
        onConfirm={onResetOnboarding}
        title={t('resetOnboarding')}
        isLoading={resetOnboarding?.isMutating}>
        {
          <div className="flex w-full flex-col text-[20px] font-normal leading-[21px] text-gray-50">
            <p className="text-start font-['Inter'] text-lg font-light text-white">
              <span className="font-semibold">{t('resetOnboardingModal.warning')}</span>
              <span>{t('resetOnboardingModal.warningMsg')}</span>
            </p>
          </div>
        }
      </ConfirmationModal>
      <ConfirmationModal
        isOpen={isResendInviteModalOpen}
        onClose={onResendInviteCloseModal}
        onConfirm={handleResendInvite}
        title={patient?.hasLoggedIn ? t('resetPassword') : t('resendInvite')}
        isLoading={resendInvite?.isMutating}>
        {
          <div className="flex w-full flex-col text-[20px] font-normal leading-[21px] text-gray-50">
            <p className="text-start font-['Inter'] text-lg font-light text-white">
              <span className="font-semibold">{t('resetOnboardingModal.warning')}</span>
              <span>
                {patient?.hasLoggedIn ? t('resendInviteModal.resetPassword') : t('resendInviteModal.resendInvite')}
              </span>
            </p>
          </div>
        }
      </ConfirmationModal>
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
