import useSWR from 'swr';
import { axiosInstance } from '../axiosConfig';
import { ParamsProps } from '@/types/api/Requests/ParamsProps.type';
import { createQueryString } from '@/utils/createQueryString';

const BASE_URL = '/Inventory/vault';

const fetcher = async (url: string) => axiosInstance.get(url).then(resp => resp.data);

const useGetVault = (params: ParamsProps & {facilityId:string }, shouldFetch: boolean = true) => {
  return useSWR(shouldFetch ? `${BASE_URL}/?${createQueryString(params)}` : null, fetcher);
};

export { useGetVault };
