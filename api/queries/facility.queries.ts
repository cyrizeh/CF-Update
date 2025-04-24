import { ApiTypes, ViewTypes } from '@/types';
import { ParamsProps } from '@/types/api/Requests/ParamsProps.type';
import { Facility } from '@/types/view';
import { createQueryString } from '@/utils/createQueryString';
import useSWR from 'swr';
import { axiosInstance } from '../axiosConfig';

const BASE_URL = '/Facilities';

const fetcher = async (url: string) => axiosInstance.get(url).then(resp => resp.data);

const useGetFacilities = (params: ParamsProps) => {
  return useSWR<ApiTypes.FacilityResponse>(`${BASE_URL}/?${createQueryString(params)}`, fetcher);
};

const useGetFacilityDetails = (params: ParamsProps): ViewTypes.QueryData<Facility> => {
  return useSWR<Facility>(`${BASE_URL}/${params?.id}?${createQueryString(params)}`, fetcher);
};

export { useGetFacilities, useGetFacilityDetails };
