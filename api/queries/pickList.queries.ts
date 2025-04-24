import useSWR from 'swr';
import { ApiTypes, ViewTypes } from '@/types';
import { axiosInstance } from '../axiosConfig';
import { ParamsProps } from '@/types/api/Requests/ParamsProps.type';
import { createQueryString } from '@/utils/createQueryString';

const BASE_URL = '/PickList';

const fetcher = async (url: string) => axiosInstance.get(url).then(resp => resp.data);

const useGetPickList = (params: ParamsProps): ViewTypes.QueryData<ApiTypes.TransportationResponse> => {
  return useSWR<ApiTypes.TransportationResponse>(`${BASE_URL}/?${createQueryString(params)}`, fetcher);
};

const useGetAccountPickList = (params: ParamsProps): ViewTypes.QueryData<ApiTypes.TransportationResponse> => {
  return useSWR<ApiTypes.TransportationResponse>(`${BASE_URL}/?${createQueryString(params)}`, fetcher);
};

const useGetClinicPickList = (params: ParamsProps): ViewTypes.QueryData<ApiTypes.TransportationResponse> => {
  return useSWR<ApiTypes.TransportationResponse>(`${BASE_URL}/?${createQueryString(params)}`, fetcher);
};

const useAdmicGetPickListDetails = (id: string) => {
  const shouldFetch = id && id.trim().length > 0;

  return useSWR(shouldFetch ? `${BASE_URL}/${id}` : null, fetcher);
};

const useClinicGetPickListDetails = (id: string) => {
  const shouldFetch = id && id.trim().length > 0;

  return useSWR(shouldFetch ? `${BASE_URL}/${id}` : null, fetcher);
};

const useAccountGetPickListDetails = (id: string) => {
  const shouldFetch = id && id.trim().length > 0;

  return useSWR(shouldFetch ? `${BASE_URL}/${id}` : null, fetcher);
};

export {
  useGetPickList,
  useAdmicGetPickListDetails,
  useGetAccountPickList,
  useGetClinicPickList,
  useClinicGetPickListDetails,
  useAccountGetPickListDetails,
};
