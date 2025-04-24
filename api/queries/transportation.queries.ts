import useSWR from 'swr';
import { ApiTypes, ViewTypes } from '@/types';
import { axiosInstance } from '../axiosConfig';
import { ParamsProps } from '@/types/api/Requests/ParamsProps.type';
import { createQueryString } from '@/utils/createQueryString';

const BASE_URL_ADMIN = '/Transportations';

export const axios = async (url: string, method: string, data?: any) =>
  axiosInstance({
    method: method,
    url: BASE_URL_ADMIN + url,
    data: data,
  });

const fetcher = async (url: string) => axiosInstance.get(url).then(resp => resp.data);

const useGetTransportationPatients = (params: ParamsProps): ViewTypes.QueryData<ApiTypes.TransportationResponse> => {
  return useSWR<ApiTypes.TransportationResponse>(`${BASE_URL_ADMIN}/?${createQueryString(params)}`, fetcher);
};

const useGetTransportationInfo = (id: string) => {
  const shouldFetch = id && id.trim().length > 0;

  return useSWR(shouldFetch ? `${BASE_URL_ADMIN}/${id}` : null, fetcher);
};

const useGetTransportationNotes = (params: ParamsProps): ViewTypes.QueryData<ApiTypes.TransportationResponse> => {
  const shouldFetch = params.patientId && params.patientId.trim().length > 0;
  return useSWR<ApiTypes.TransportationResponse>(
    shouldFetch ? `${BASE_URL_ADMIN}/note?${createQueryString(params)}` : null,
    fetcher
  );
};

const useGetTransportationDocuments = (params: ParamsProps): ViewTypes.QueryData<ApiTypes.TransportationDocumentsResponse> => {
  const shouldFetch = params.patientId && params.patientId.trim().length > 0;
  return useSWR<ApiTypes.TransportationDocumentsResponse>(
    shouldFetch ? `${BASE_URL_ADMIN}/${params.transportationRequestId}/documents` : null,
    fetcher
  );
};

export { useGetTransportationPatients, useGetTransportationInfo, useGetTransportationNotes, useGetTransportationDocuments };
