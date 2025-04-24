import useSWR from 'swr';
import { ApiTypes, ViewTypes } from '@/types';
import { axiosInstance } from '../axiosConfig';
import { createQueryString } from '@/utils/createQueryString';
import { ParamsProps } from '@/types/api/Requests/ParamsProps.type';

const BASE_URL = '/Accounts';

const fetcher = async (url: string) => axiosInstance.get(url).then(resp => resp.data);

const useGetAccountById = (accountId: string): any => {
  const shouldFetch = accountId && accountId.trim().length > 0;
  return useSWR<any>(shouldFetch?`${BASE_URL}/${accountId}`:null, fetcher);
};

const useGetClinicsByAccountId = (params: ParamsProps): any => {
  const shouldFetch = params.id && params.id.trim().length > 0;
  return useSWR<any>(shouldFetch?`${BASE_URL}/${params.id}/clinics?${createQueryString(params)}`:null, fetcher);
};

const useGetPatientsByAccountId = (params: ParamsProps): any => {
  const shouldFetch = params.id && params.id.trim().length > 0;
  return useSWR<any>(shouldFetch? `${BASE_URL}/${params.id}/patients?${createQueryString(params)}`:null, fetcher);
};

const useGetAccountsTransportationRequests =(params: ParamsProps): any => {
  const shouldFetch = params.id && params.id.trim().length > 0;
  return useSWR<any>(shouldFetch?`${BASE_URL}/${params.id}/Transportations/?${createQueryString(params)}`: null, fetcher);
 };

const useGetSpecimensByAccountId = (params: ParamsProps): any => {
  const shouldFetch = params.id && params.id.trim().length > 0;
  return useSWR<any>(shouldFetch? `${BASE_URL}/${params.id}/specimens?${createQueryString(params)}`: null, fetcher);
};

export { useGetAccountById, useGetClinicsByAccountId, useGetPatientsByAccountId, useGetSpecimensByAccountId, useGetAccountsTransportationRequests };
