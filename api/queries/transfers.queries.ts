import useSWR from 'swr';
import { ApiTypes } from '@/types';
import { axiosInstance } from '../axiosConfig';
import { createQueryString } from '@/utils/createQueryString';
import { ParamsProps } from '@/types/api/Requests/ParamsProps.type';

const BASE_URL = '/Transfers';

const fetcher = async (url: string) => axiosInstance.get(url).then(resp => resp.data);

const useGetToClinicByCane = (params: ParamsProps) => {
  return useSWR<any>(`${BASE_URL}/toClinic/${params.id}`, fetcher);
};

const useGetToLocationByCane =(params: ParamsProps) => {
  return useSWR<any>(`${BASE_URL}/toLocation/${params.id}`, fetcher);
};
const useGetToClinic = (params: ParamsProps) => {
  return useSWR<ApiTypes.TransferResponse>(`${BASE_URL}/toClinic?${createQueryString(params)}`, fetcher);
};

const useGetToLocation = (params: ParamsProps) => {
  return useSWR<ApiTypes.TransferResponse>(`${BASE_URL}/toLocation?${createQueryString(params)}`, fetcher);
};

export { useGetToClinic, useGetToLocation, useGetToClinicByCane, useGetToLocationByCane};
