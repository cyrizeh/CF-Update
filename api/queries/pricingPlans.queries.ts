import { ApiTypes, ViewTypes } from '@/types';
import useSWR from 'swr';
import { axiosInstance } from '../axiosConfig';
import { ParamsProps } from '@/types/api/Requests/ParamsProps.type';
import { createQueryString } from '@/utils/createQueryString';

const BASE_URL = '/PricingPlans';

const fetcher = async (url: string) => axiosInstance.get(url).then(resp => resp.data);

const useGetPricingPlans = (params: ParamsProps): ViewTypes.QueryData<ApiTypes.PricingPlansListResponse> => {
  return useSWR<ApiTypes.PricingPlansListResponse>(`${BASE_URL}/?${createQueryString(params)}`, fetcher);
};

const useGetPricingPlanById = (planId: string): ViewTypes.QueryData<ApiTypes.PricingPlanResponse> => {
  const shouldFetch = planId && planId.trim().length > 0;

  return useSWR<ApiTypes.PricingPlanResponse>(shouldFetch ? `${BASE_URL}/${planId}` : null, fetcher);
};

const useGetPricingPlanVersion = (planId: string, version: string) => {
  const shouldFetch = planId && version && planId.trim().length > 0 && version.trim().length > 0;

  return useSWR(shouldFetch ? `${BASE_URL}/${planId}/${version}` : null, fetcher);
};

const useGetPricingPlanServices = (planId?: string) => {
  return useSWR(`${BASE_URL}/services?${createQueryString({ planId })}`, fetcher);
};

export { useGetPricingPlanById, useGetPricingPlans, useGetPricingPlanServices, useGetPricingPlanVersion };
