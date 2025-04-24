import useSWR from 'swr';
import { axiosInstance } from '../axiosConfig';
import { ParamsProps } from '@/types/api/Requests/ParamsProps.type';
import { createQueryString } from '@/utils/createQueryString';

const BASE_URL = '/Accounts';

const fetcher = async (url: string) => axiosInstance.get(url).then(resp => resp.data);

const useGetAccounts = (params: ParamsProps, shouldFetch: boolean = true) => {
  return useSWR(shouldFetch ? `${BASE_URL}/?${createQueryString(params)}` : null, fetcher);
};

export { useGetAccounts };
