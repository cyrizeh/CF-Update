import { ParamsProps } from '@/types/api/Requests/ParamsProps.type';
import { createQueryString } from '@/utils/createQueryString';
import useSWR from 'swr';
import { axiosInstance } from '../axiosConfig';

const BASE_ADMIN_URL = '/Admin';
const BASE_DOCUMENT_URL = '/Documents';
const BASE_PATIENT_URL = '/Patients';
const PATIENT_DOCUMENT_ROUTE = '/DownloadSignedDocument';

export const buildAdminDocumentEndpoint = (id: string) => `${BASE_DOCUMENT_URL}${BASE_PATIENT_URL}/${id}/download`;
export const buildPatientDocumentEndpoint = (id: string) =>
  `${BASE_PATIENT_URL}${PATIENT_DOCUMENT_ROUTE}?patientDocumentId=${id}`;
export const buildPatientStatementEndpoint = (id: string) => `${BASE_PATIENT_URL}/${id}/statement`;
export const buildPatientStatementEndpointForAdmin = (patientId: string, statementId: string) =>
  `${BASE_ADMIN_URL}/${BASE_PATIENT_URL}/${patientId}/statements/${statementId}`;

const fetcher = async (url: string) => axiosInstance.get(url).then(resp => resp.data);

const useGetDocuments = (params: ParamsProps) => {
  const queryString = createQueryString(params);
  const endpoint = `${BASE_DOCUMENT_URL}/${BASE_PATIENT_URL}?${queryString}`;
  return useSWR(endpoint, fetcher);
};

const useGetPatientDocumentById = (params: ParamsProps) => {
  const endpoint = buildPatientDocumentEndpoint(params?.id as string);

  return useSWR(endpoint, fetcher);
};

const useAdminGetPatientDocumentById = (params: ParamsProps) => {
  const endpoint = buildAdminDocumentEndpoint(params?.id as string);

  return useSWR(endpoint, fetcher);
};

const useGetPatientBillingStatement = (params: ParamsProps) => {
  const endpoint = buildPatientStatementEndpoint(params?.id as string);

  return useSWR(endpoint, fetcher);
};

const useGetAdminPatientBillingStatement = (params: ParamsProps) => {
  const endpoint = buildPatientStatementEndpointForAdmin(params?.patientId as string, params?.id as string);

  return useSWR(endpoint, fetcher);
};

export {
  useAdminGetPatientDocumentById,
  useGetDocuments,
  useGetPatientBillingStatement,
  useGetPatientDocumentById,
  useGetAdminPatientBillingStatement,
};
