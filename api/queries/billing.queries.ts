import useSWR from 'swr';
import { ApiTypes, ViewTypes } from '@/types';
import { axiosInstance } from '../axiosConfig';
import { ParamsProps } from '@/types/api/Requests/ParamsProps.type';
import { createQueryString } from '@/utils/createQueryString';

const BASE_URL = '/Payments';

const fetcher = async (url: string) => axiosInstance.get(url).then(resp => resp.data);

const useGetBillingInfo = (params: ParamsProps, shouldFetch = true): ViewTypes.QueryData<ApiTypes.BillingResponse> => {
  const url = shouldFetch ? `${BASE_URL}/?${createQueryString(params)}` : null;
  return useSWR<ApiTypes.BillingResponse>(url, fetcher);
};

export { useGetBillingInfo };
