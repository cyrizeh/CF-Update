import useSWRMutation from 'swr/mutation';
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

const useDocumentMutation = () => {
  const getAdminPatientDocumentFetcher = (url: string, { arg: { id } }: { arg: { id: string } }) => {
    return axiosInstance.get(buildAdminDocumentEndpoint(id));
  };

  const useGetPatientDocumentFetcher = (url: string, { arg: { id } }: { arg: { id: string } }) => {
    return axiosInstance.get(buildPatientDocumentEndpoint(id));
  };
  
  const useGetPatientStatementFetcher = (url: string, { arg: { id } }: { arg: { id: string } }) => {
    return axiosInstance.get(buildPatientStatementEndpoint(id));
  };
  
  const useGetAdminPatientStatementFetcher = (url: string, { arg: { patientId, id } }: { arg: { patientId: string, id: string } }) => {
    return axiosInstance.get(buildPatientStatementEndpointForAdmin(patientId, id));
  };

  const getPatientDocumentForAdmin = useSWRMutation('getAdminPatientDocument', getAdminPatientDocumentFetcher);

  const getPatientDocument = useSWRMutation('getPatientDocument', useGetPatientDocumentFetcher);
  const getPatientStatement = useSWRMutation('getPatientStatement', useGetPatientStatementFetcher);
  const getAdminPatientStatement = useSWRMutation('getAdminPatientStatement', useGetAdminPatientStatementFetcher);


  return {
    getPatientDocumentForAdmin,
    getPatientDocument,
    getPatientStatement,
    getAdminPatientStatement,
  };
};

export default useDocumentMutation;
