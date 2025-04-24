import useSWR from 'swr';
import { ApiTypes, ViewTypes } from '@/types';
import { axiosInstance } from '../axiosConfig';
import { createQueryString } from '@/utils/createQueryString';
import { ParamsProps } from '@/types/api/Requests/ParamsProps.type';

const BASE_URL = '/Clinics';

const fetcher = async (url: string) => axiosInstance.get(url).then(resp => resp.data);

const useGetClinics = (params: ParamsProps, isCryoAdmin = true) => {
  return useSWR<ApiTypes.ClinicsResponse>(isCryoAdmin ? `${BASE_URL}/?${createQueryString(params)}` : null, fetcher);
};

const useGetClinicById = (clinicId: string): ViewTypes.QueryData<ViewTypes.Clinic> => {
  const shouldFetch = clinicId && clinicId.trim().length > 0;
  return useSWR<ViewTypes.Clinic>(shouldFetch? `${BASE_URL}/${clinicId}`: null, fetcher);
};

const useGetClinicsBilling = (clinicId: string, year: string | undefined = undefined) => {
  return useSWR(`${BASE_URL}/${clinicId}/PricingPlan/${year ?? ''}`, fetcher);
};

const useGetClinicSpecimens = (params: ParamsProps): ViewTypes.QueryData<ApiTypes.SpecimensResponse> => {
  return useSWR<ApiTypes.SpecimensResponse>(`${BASE_URL}/${params.id}/Specimens?${createQueryString(params)}`, fetcher);
};

const useGetClinicsPatients =(params: ParamsProps): any => {
 return useSWR<any>(`${BASE_URL}/${params.id}/Patients/?${createQueryString(params)}`, fetcher);
};

const useGetClinicsTransportationRequests =(params: ParamsProps): any => {
  const shouldFetch = params.id && params.id.trim().length > 0;
  return useSWR<any>(shouldFetch? `${BASE_URL}/${params.id}/Transportations/?${createQueryString(params)}`: null, fetcher);
 };
export { useGetClinics, useGetClinicById, useGetClinicsBilling, useGetClinicSpecimens, useGetClinicsPatients, useGetClinicsTransportationRequests };
