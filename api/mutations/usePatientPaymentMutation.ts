import useSWRMutation from 'swr/mutation';
import { ApiTypes } from '@/types';
import { axiosInstance } from '../axiosConfig';
import { AxiosResponse } from 'axios';
import { PatientBillingResponse } from '@/types/api/Responses/PatientBillingResponse.types';

const BASE_URL = '/Patients';
const TRANSPORTATION_URL = '/Transportations';
const buildPayNowMethodUrl = () => `${BASE_URL}/PayNowV2`;
const buildPaymentMethodV2Url = () => `${BASE_URL}/PaymentMethodV2`;
const buildPaymentMethodV2UrlByAdmin = () => ``;
const buildTransportationPaymentUrl = (transportationRequestId: string) =>
  `${BASE_URL}${TRANSPORTATION_URL}/${transportationRequestId}/PayV2`;
const buildSubscribeOnExtraProtectionProgramUrl = () => `${BASE_URL}/ExtraProtection`;
const buildUNSubscribeOnExtraProtectionProgramUrl = () => `${buildSubscribeOnExtraProtectionProgramUrl()}/Unsubscribe`;

const usePatientPaymentMutation = () => {
  const payNowFetcher = (
    url: string,
    { arg }: { arg: ApiTypes.CreatePatientPaymentRequest }
  ): Promise<AxiosResponse<PatientBillingResponse>> => {
    return axiosInstance.post(buildPayNowMethodUrl(), arg);
  };

  const schedulePaymentFetcher = (
    url: string,
    { arg }: { arg: ApiTypes.CreatePatientPaymentRequest }
  ): Promise<AxiosResponse<PatientBillingResponse>> => {
    return axiosInstance.post(buildPaymentMethodV2Url(), arg);
  };

  const schedulePaymentByAdminFetcher = (
    url: string,
    { arg }: { arg: ApiTypes.CreatePatientPaymentRequestByAdmin }
  ): Promise<AxiosResponse<PatientBillingResponse>> => {
    return axiosInstance.post(`admin/patients/${arg.patientId}/PaymentMethod`, arg);
  };

  const transportationOnBoardingPayment = (
    url: string,
    { arg }: { arg: ApiTypes.CreateTransportationsPatientPaymentRequest }
  ): Promise<AxiosResponse<PatientBillingResponse>> => {
    return axiosInstance.post(buildTransportationPaymentUrl(arg?.transportationRequestId), {
      ...arg,
    });
  };

  const subscribeOnExtraprotectionProgramFetcher = (url: string): Promise<AxiosResponse<PatientBillingResponse>> => {
    return axiosInstance.post(buildSubscribeOnExtraProtectionProgramUrl());
  };
  const unSubscribeOnExtraprotectionProgramFetcher = (url: string): Promise<AxiosResponse<PatientBillingResponse>> => {
    return axiosInstance.post(buildUNSubscribeOnExtraProtectionProgramUrl());
  };
  const handlePayNow = useSWRMutation('patientPaymentPayNow', payNowFetcher);
  const handleSchedulePayment = useSWRMutation('patientSchedulePayment', schedulePaymentFetcher);
  const handleTransportationOnBoardingPayment = useSWRMutation(
    'transportationOnBoardingPayment',
    transportationOnBoardingPayment
  );

  const handleSchedulePaymentByAdmin = useSWRMutation('patientSchedulePayment', schedulePaymentByAdminFetcher);

  const subscribeOnExtraprotectionProgram = useSWRMutation(
    'subscribeOnExtraprotectionProgramFetcher',
    subscribeOnExtraprotectionProgramFetcher
  );
  const unSubscribeOnExtraprotectionProgram = useSWRMutation(
    'unSubscribeOnExtraprotectionProgramFetcher',
    unSubscribeOnExtraprotectionProgramFetcher
  );

  const eppChoiceFetcher = (url: string, { arg }: { arg: any }) => {
    return axiosInstance.post(`${BASE_URL}/eppChoice`, arg);
  };

  const eppChoice = useSWRMutation('eppChoice', eppChoiceFetcher);

  const eppChoiceByAdminFetcher = (url: string, { arg }: { arg: any }) => {
    return axiosInstance.post(`admin/patients/${arg.patientId}/eppChoice`, arg);
  };

  const eppChoiceByAdmin = useSWRMutation('eppChoice', eppChoiceByAdminFetcher);
  const updateServiceGuaranteeFetch = async (
    url: string,
    { arg }: { arg: { transferServiceGuaranteeId: string | null } }
  ) => {
    return axiosInstance.post(`/Patients/ServiceGuarantee`, arg);
  };

  const updateServiceGuarantee = useSWRMutation('updateServiceGuarantee', updateServiceGuaranteeFetch);

  const updatePatientPlanFetch = async (url: string, { arg }: { arg: any }) => {
    return axiosInstance.post(`/Patients/SelectStoragePlan`, arg);
  };
  const updatePatientPlan = useSWRMutation('billing', updatePatientPlanFetch);

  const defaultStoragePlanFetcher = (url: string, { arg }: { arg: any }) => {
    return axiosInstance.post(`/Patients/DefaultStoragePlan`, arg);
  };

  const defaultStoragePlan  = useSWRMutation('defaultStoragePlan', defaultStoragePlanFetcher);



  return {
    handlePayNow,
    handleSchedulePayment,
    handleTransportationOnBoardingPayment,
    subscribeOnExtraprotectionProgram,
    unSubscribeOnExtraprotectionProgram,
    eppChoice,
    eppChoiceByAdmin,
    handleSchedulePaymentByAdmin,
    updateServiceGuarantee,
    updatePatientPlan,
    defaultStoragePlan,
  };
};

export default usePatientPaymentMutation;
