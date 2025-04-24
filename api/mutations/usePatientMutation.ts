import useSWRMutation from 'swr/mutation';

import { axiosInstance } from '../axiosConfig';

const BASE_PATIENT_URL = '/Patients';
const BASE_ADMIN_URL = '/Admin';

const usePatientMutation = (patientId: string) => {
  const updateBillingFetcher = (url: string, { arg }: { arg: any }) => {
    return axiosInstance.post(`/admin/Patients/${patientId}/PricingPlan`, arg);
  };

  const updatePatientBilling = useSWRMutation('billing', updateBillingFetcher);

  const updatePatientDetailsFetcher = async (url: string, { arg }: { arg: any }) => {
    return axiosInstance.put(`/Patients`, arg);
  };

  const { trigger: updatePatientDetails } = useSWRMutation('updatePatient', updatePatientDetailsFetcher);

  const updatePatientProfileFetcher = async (url: string, { arg }: { arg: any }) => {
    return axiosInstance.put(`/admin/Patients/${arg.patientId}`, arg);
  };

  const { trigger: updatePatientProfile } = useSWRMutation('updatePatientProfile', updatePatientProfileFetcher);

  const updatePatientBillingDateFetcher = async (url: string, { arg }: { arg: any }) => {
    return axiosInstance.put(`/admin/Patients/BillingDate`, arg);
  };

  const { trigger: updatePatientBillingDate } = useSWRMutation(
    'updatePatientBillingDate',
    updatePatientBillingDateFetcher
  );

  const updateSpecimenReceivedDateFetcher = async (url: string, { arg }: { arg: any }) => {
    return axiosInstance.put(`/admin/Patients/SpecimenReceivedDate`, arg);
  };

  const { trigger: updateSpecimenReceivedDate } = useSWRMutation(
    'updateSpecimenReceivedDate',
    updateSpecimenReceivedDateFetcher
  );

  const changeextraProtectionProgramAutoRenewStateFetcher = async (
    url: string,
    {
      arg,
    }: {
      arg: {
        autoRenew: boolean;
      };
    }
  ) => {
    return axiosInstance.post(`${BASE_PATIENT_URL}/ExtraProtection/AutoRenew`, arg);
  };

  const changeExtraProtectionProgramAutoRenewState = useSWRMutation(
    'changeextraProtectionProgramAutoRenewState',
    changeextraProtectionProgramAutoRenewStateFetcher
  );

  const deleteAttachmentFetcher = (url: string, { arg }: { arg: { attachmentId: string } }) => {
    return axiosInstance.delete(`${BASE_ADMIN_URL}${BASE_PATIENT_URL}/${patientId}/Attachments/${arg.attachmentId}`);
  };

  const deleteAttachment = useSWRMutation('deleteAttachment', deleteAttachmentFetcher);

  const updatePatientDonorInfoFetcher = (url: string, { arg }: { arg: any }) => {
    return axiosInstance.post(`${BASE_ADMIN_URL}${BASE_PATIENT_URL}/DonorInformation`, { ...arg });
  };

  const updatePatientDonorInfo = useSWRMutation('updatePatientDonorInfo', updatePatientDonorInfoFetcher);

  const addLinkedAccFetcher = (url: string, { arg }: { arg: { patientId: string; partnerId: string } }) => {
    return axiosInstance.post(`${BASE_ADMIN_URL}${BASE_PATIENT_URL}/${arg?.patientId}/link`, { ...arg });
  };

  const addLinkedAcc = useSWRMutation('addLinkedAcc', addLinkedAccFetcher);

  const deleteLinkedAccFetcher = (url: string, { arg }: { arg: { patientId: string; partnerId: string } }) => {
    return axiosInstance.delete(`${BASE_ADMIN_URL}${BASE_PATIENT_URL}/${arg?.patientId}/deleteLink/${arg?.partnerId}`);
  };

  const deleteLinkedAcc = useSWRMutation('deleteLinkedAcc', deleteLinkedAccFetcher);

  const mergeTrasportationUserToStorageUserFetcher = (
    url: string,
    { arg }: { arg: { patientId: string; clinicId: string; facilityId: string } }
  ) => {
    return axiosInstance.post(`${BASE_ADMIN_URL}${BASE_PATIENT_URL}/${arg?.patientId}/merge`, { ...arg });
  };

  const mergeTrasportationUserToStorageUser = useSWRMutation(
    'mergeTrasportationUserToStorageUser',
    mergeTrasportationUserToStorageUserFetcher
  );

  const addPatientNoteFetcher = async (url: string, { arg }: { arg: { text: string; patientId: string } }) => {
    return axiosInstance.post(`${BASE_ADMIN_URL}${BASE_PATIENT_URL}/${arg?.patientId}/note`, { ...arg });
  };

  const addPatientNote = useSWRMutation('addPatientNote', addPatientNoteFetcher);

  const createAccountFetcher = async (
    url: string,
    { arg }: { arg: { onboardingType: string; witnessId: string | null; patientId: string } }
  ) => {
    return axiosInstance.post(`${BASE_ADMIN_URL}${BASE_PATIENT_URL}/${patientId}/createAccount`, { ...arg });
  };

  const createAccount = useSWRMutation('createAccount', createAccountFetcher);

  const downloadPatientAttachmentFetcher = async (
    url: string,
    { arg }: { arg: { patientId: string; documentId: string; isPatient: boolean } }
  ) => {
    const { patientId, documentId, isPatient } = arg;
    const endpoint = isPatient
      ? `patients/attachments/${documentId}/download`
      : `admin/patients/${patientId}/attachments/${documentId}/download`;
    return axiosInstance.get(endpoint);
  };

  const downloadPatientAttachment = useSWRMutation('attachment', downloadPatientAttachmentFetcher);

  const deleteBillingCycleFetcher = (url: string, { arg }: { arg: { id: string } }) => {
    return axiosInstance.delete(`${BASE_ADMIN_URL}${BASE_PATIENT_URL}/${patientId}/billingCycles/${arg?.id}`);
  };

  const deleteBillingCycle = useSWRMutation('deleteBillingCycle', deleteBillingCycleFetcher);

  const addBillingCycleFetch = async (
    url: string,
    { arg }: { arg: { specimenTypes: string[]; billingDate: string | null } }
  ) => {
    return axiosInstance.post(`${BASE_ADMIN_URL}${BASE_PATIENT_URL}/${patientId}/billingCycles`, arg);
  };

  const addBillingCycle = useSWRMutation('addBillingCycle', addBillingCycleFetch);

  const selectStoragePlanFetcher = (url: string, { arg }: { arg: any }) => {
    return axiosInstance.post(`${BASE_PATIENT_URL}/SelectStoragePlan`, arg);
  };

  const { trigger: selectStoragePlan } = useSWRMutation('selectStoragePlan', selectStoragePlanFetcher);

  const selectStoragePlanByAdminFetcher = (url: string, { arg }: { arg: any }) => {
    return axiosInstance.post(`admin/patients/${arg.patientId}/StoragePlan`, arg);
  };

  const { trigger: selectStoragePlanByAdmin } = useSWRMutation('StoragePlan', selectStoragePlanByAdminFetcher);

  const resendInviteFetcher = (url: string, { arg }: { arg: any }) => {
    return axiosInstance.post(`${BASE_ADMIN_URL}${BASE_PATIENT_URL}/${patientId}/ResendInvite`);
  };

  const resendInvite = useSWRMutation('resendInvite', resendInviteFetcher);

  const resetOnboardingFetcher = (url: string, { arg }: { arg: any }) => {
    return axiosInstance.post(`${BASE_ADMIN_URL}${BASE_PATIENT_URL}/${patientId}/reset`);
  };

  const resetOnboarding = useSWRMutation('resetOnboarding', resetOnboardingFetcher);

  const changeStoragePlanFetcher = (url: string, { arg }: { arg: any }) => {
    return axiosInstance.put(`${BASE_PATIENT_URL}/StoragePlan`, arg);
  };

  const changeStoragePlan = useSWRMutation('changeStoragePlan', changeStoragePlanFetcher);

  const changeStoragePlanByAdminFetcher = (url: string, { arg }: { arg: any }) => {
    return axiosInstance.put(`${BASE_ADMIN_URL}${BASE_PATIENT_URL}/${patientId}/StoragePlan`, arg);
  };

  const changeStoragePlanByAdmin = useSWRMutation('changeStoragePlanByAdmin', changeStoragePlanByAdminFetcher);

  return {
    updatePatientBilling,
    updatePatientDetails,
    updatePatientProfile,
    updatePatientBillingDate,
    updateSpecimenReceivedDate,
    changeExtraProtectionProgramAutoRenewState,
    deleteAttachment,
    updatePatientDonorInfo,
    addLinkedAcc,
    deleteLinkedAcc,
    mergeTrasportationUserToStorageUser,
    addPatientNote,
    createAccount,
    downloadPatientAttachment,
    deleteBillingCycle,
    addBillingCycle,
    selectStoragePlan,
    selectStoragePlanByAdmin,
    resendInvite,
    resetOnboarding,
    changeStoragePlan,
    changeStoragePlanByAdmin,
  };
};

export default usePatientMutation;
