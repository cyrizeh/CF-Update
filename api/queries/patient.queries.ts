import useSWR from 'swr';
import { ApiTypes, ViewTypes } from '@/types';
import { axiosInstance } from '../axiosConfig';
import { ParamsProps } from '@/types/api/Requests/ParamsProps.type';
import { createQueryString } from '@/utils/createQueryString';
import { AxiosError } from 'axios';

// Base URLs
const BASE_URL_ADMIN = '/admin/Patients';
const BASE_URL = '/Patients';

// Endpoints
const ENDPOINT_PAYMENT_INFORMATION = '/PaymentInformation';
const ENDPOINT_PAYMENT_PLAN = '/PaymentPlan';
const ENDPOINT_EXTRA_PROTECTION = '/ExtraProtection';
const ENDPOINT_WITNESS = '/Witness';
const ENDPOINT_TRANSPORTATIONS = '/Transportations';
const ENDPOINT_ATTACHMENTS = '/attachments';
const ENDPOINT_PATIENT_ATTACHMENTS = 'patients/attachments';
const ENDPOINT_STORAGE_PLAN = '/StoragePlan';
const ENDPOINT_COMPARE_PLANS = '/ComparePlans';
const ENDPOINT_EPP = '/eppChoice';


const fetcher = async (url: string) => axiosInstance.get(url).then(resp => resp.data);

export const axios = async (url: string, method: string, data?: any) =>
  axiosInstance({
    method: method,
    url: BASE_URL_ADMIN + url,
    data: data,
  });

export const axiosPatient = async (url: string, method: string, data?: any) =>
  axiosInstance({
    method: method,
    url: BASE_URL + url,
    data: data,
  });

const useGetPatients = (params: ParamsProps): ViewTypes.QueryData<ApiTypes.PatientsResponse> => {
  const url = `${BASE_URL_ADMIN}/?${createQueryString(params)}`;
  return useSWR<ApiTypes.PatientsResponse>(url, fetcher);
};

const useGetPatientsById = (patientId: string): ViewTypes.QueryData<ApiTypes.PatientResponse> => {
  const url = `${BASE_URL_ADMIN}/${patientId}`;
  const shouldFetch = patientId && patientId.trim().length > 0;
  return useSWR<ApiTypes.PatientResponse>(shouldFetch ? url : null, fetcher, {
    onErrorRetry: (error: AxiosError, key, config, revalidate, { retryCount }) => {
      if (error.response?.status === 403) return;
      if (retryCount >= 3) return;
    },
  });
};

const useGetPatientsByClinic = (params: ParamsProps): ViewTypes.QueryData<ApiTypes.PatientsResponse> => {
  const url = `${BASE_URL_ADMIN}/?clinicId=${params.id}&${createQueryString(params)}`;
  return useSWR<ApiTypes.PatientsResponse>(url, fetcher);
};

const useGetPatientsBilling = (clinicId: string) => {
  const url = `${BASE_URL_ADMIN}/${clinicId}/PricingPlan`;
  return useSWR(url, fetcher);
};

const useGetPaymentInfo = () => {
  return useSWR(`${BASE_URL}${ENDPOINT_PAYMENT_INFORMATION}`, fetcher);
};


const useGetNextPaymentByAdmin = (id: string) => {
  return useSWR(`${BASE_URL_ADMIN}/${id}/nextPayment`, fetcher);
};

const useGetPaymentPlan = () => {
  return useSWR(`${BASE_URL}${ENDPOINT_PAYMENT_PLAN}`, fetcher);
};

const useGetPatientInfo = () => {
  return useSWR(BASE_URL, fetcher);
};

const useGetTransportationInfo = (id: string) => {
  const url = `${BASE_URL}${ENDPOINT_TRANSPORTATIONS}/${id}`;
  return useSWR(url, fetcher);
};
const useGetStoragePlan = () => {
  const url = `${BASE_URL}${ENDPOINT_STORAGE_PLAN}`;
  return useSWR(url, fetcher);
};

const useGetStoragePlanByAdmin = (id: string) => {
  const url = `${BASE_URL_ADMIN}/${id}/${ENDPOINT_STORAGE_PLAN}`;
  return useSWR(url, fetcher);
}

const useGetComparePlans = () => {
  const url = `${BASE_URL}${ENDPOINT_COMPARE_PLANS}`;
  return useSWR(url, fetcher);
};

const useGetComparePlansByAdmin = (id: string) => {
  const url = `${BASE_URL_ADMIN}/${id}/${ENDPOINT_COMPARE_PLANS}`;
  return useSWR(url, fetcher);
}

const useGetEPP = () => {
  const url = `${BASE_URL}${ENDPOINT_EPP}`;
  return useSWR(url, fetcher);
};

const useGetTransportations = () => {
  const url = `${BASE_URL}${ENDPOINT_TRANSPORTATIONS}`;
  return useSWR(url, fetcher);
};

const partnerFetcher = async (url: string) => {
    const response = await axiosInstance.get(`${BASE_URL}${ENDPOINT_TRANSPORTATIONS}/Partner`);
    return response.data;
};

const useGetPartnerTransportations = () => {
  const key = `${BASE_URL}${ENDPOINT_TRANSPORTATIONS}/Partner`;
  return useSWR(key, partnerFetcher);
};

const useGetPatientAttachments = (id: string, params: ParamsProps, isPatient: boolean) => {
  const url = isPatient
    ? `${ENDPOINT_PATIENT_ATTACHMENTS}/?${createQueryString(params)}`
    : `${BASE_URL_ADMIN}/${id}${ENDPOINT_ATTACHMENTS}/?${createQueryString(params)}`;
  return useSWR(url, fetcher);
};

const useGetPatientPaymentMethod = ({
  isPatient,
}: {
  isPatient: boolean;
}): ViewTypes.QueryData<ApiTypes.PatientPaymentResponse> => {
  const url = isPatient ? `${BASE_URL}/PaymentMethod` : null;
  return useSWR<ApiTypes.PatientPaymentResponse>(url, fetcher);
};

const useGetPatientPaymentMethodById = ({
  patientId,
}: {
  patientId: string;
}): ViewTypes.QueryData<ApiTypes.PatientPaymentResponse> => {
  const url =`${BASE_URL_ADMIN}/${patientId}/PaymentMethod`;
  return useSWR<ApiTypes.PatientPaymentResponse>(url, fetcher,
    {
      onErrorRetry: (error: AxiosError, key, config, revalidate, { retryCount }) => {
        if (error.response?.status === 404) return; 
        if (retryCount >= 3) return; 
      },
    });
};


const useGetPaymentPatientPlan = ({ isPatient }: { isPatient: boolean }) => {
  const url = isPatient ? `${BASE_URL}${ENDPOINT_PAYMENT_PLAN}` : null;
  return useSWR(url, fetcher);
};

const useGetExtraProtectionSubscriptionPatientPlan = ({
  isPatient,
}: {
  isPatient: boolean;
}): ViewTypes.QueryData<{
  paymentAmount: number;
  nextBillingDate: string;
  extraProtectionPrice: number;
}> => {
  const url = isPatient ? `${BASE_URL}${ENDPOINT_EXTRA_PROTECTION}` : null;
  return useSWR<{ paymentAmount: number; nextBillingDate: string; extraProtectionPrice: number }>(url, fetcher);
};
const useGetExtraProtectionSubscriptionPlanByAdmin = ({
 patientId
}: {
  patientId: string;
}): ViewTypes.QueryData<{
  paymentAmount: number;
  nextBillingDate: string;
  extraProtectionPrice: number;
}> => {
  const url =  `${BASE_URL_ADMIN}/${patientId}${ENDPOINT_EXTRA_PROTECTION}/calculate`;
  return useSWR<{ paymentAmount: number; nextBillingDate: string; extraProtectionPrice: number }>(url, fetcher);
};

const useGetPatientsWitness = () => {
  return useSWR(ENDPOINT_WITNESS, fetcher);
};

const useGetPatientBillingByCycle = (
  params: ParamsProps
): ViewTypes.QueryData<ApiTypes.PatientBillingByCycleItem[]> => {
  const url = `${BASE_URL_ADMIN}/${params?.patientId}/billingCycles`;
  return useSWR<ApiTypes.PatientBillingByCycleItem[]>(url, fetcher);
};

const useGetPatientBillingStatements = (
  params: ParamsProps
): ViewTypes.QueryData<ApiTypes.BillingStatementResponse> => {
  return useSWR<ApiTypes.BillingStatementResponse>(`${BASE_URL}/statement?${createQueryString(params)}`, fetcher);
};

const useGetPatientBillingStatementsForAdmin = (
  id: string,
  params: ParamsProps
): ViewTypes.QueryData<ApiTypes.BillingStatementResponse> => {
  return useSWR<ApiTypes.BillingStatementResponse>(
    `${BASE_URL_ADMIN}/${id}/statements?${createQueryString(params)}`,
    fetcher
  );
};

const useGetPatientTransportations = (params: ParamsProps): any => {
  return useSWR<any>(`${BASE_URL}${ENDPOINT_TRANSPORTATIONS}?${createQueryString(params)}`, fetcher);
};

const useGetPatientReceivedDates = (shouldFetch: boolean) => {
  const url = shouldFetch ? `${BASE_URL}/receivedDates` : null;
  return useSWR(url, fetcher);
};

const useGetAdminPatientEPP = (params: ParamsProps) => {
  const url = params?.id ? `${BASE_URL_ADMIN}/${params?.id}/extraProtection` : null;
  return useSWR(url, fetcher);
};

export {
  useGetPatients,
  useGetPatientsByClinic,
  useGetPatientsById,
  useGetPatientsBilling,
  useGetPaymentInfo,
  useGetPatientInfo,
  useGetPatientAttachments,
  useGetTransportationInfo,
  useGetPatientPaymentMethod,
  useGetPaymentPlan,
  useGetPaymentPatientPlan,
  useGetExtraProtectionSubscriptionPatientPlan,
  useGetPatientsWitness,
  useGetPatientBillingByCycle,
  useGetPatientBillingStatements,
  useGetPatientBillingStatementsForAdmin,
  useGetPatientTransportations,
  useGetPatientReceivedDates,
  useGetTransportations,
  useGetAdminPatientEPP,
  useGetPartnerTransportations,
  useGetStoragePlan,
  useGetEPP,
  useGetComparePlans,
  useGetStoragePlanByAdmin,
  useGetNextPaymentByAdmin,
  useGetExtraProtectionSubscriptionPlanByAdmin,
  useGetComparePlansByAdmin,
  useGetPatientPaymentMethodById
};
