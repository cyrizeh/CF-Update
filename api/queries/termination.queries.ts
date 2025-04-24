
import useSWR from 'swr';
import { axiosInstance } from '../axiosConfig';
import { ParamsProps } from '@/types/api/Requests/ParamsProps.type';
import { createQueryString } from '@/utils/createQueryString';
import { ApiTypes, ViewTypes } from '@/types';

const BASE_URL = '/TerminationRequests';

const fetcher = async (url: string) => axiosInstance.get(url).then(resp => resp.data);

const useGetTerminationRequests = (params: ParamsProps): ViewTypes.QueryData<ApiTypes.TerminationResponse> => {
  return useSWR<any>(`${BASE_URL}/?${createQueryString(params)}`, fetcher);
};

const useGetTerminationRequestsById = (params: ParamsProps) => {
  return useSWR<any>(`${BASE_URL}/${params.id}`, fetcher);
};

const useGetPatientsTerminationRequests = (params: ParamsProps) => {
  return useSWR<any>(`/Patients/terminationRequests`, fetcher);
};

export { useGetTerminationRequests, useGetPatientsTerminationRequests, useGetTerminationRequestsById };
