
import useSWR from 'swr';
import { axiosInstance } from '../axiosConfig';
import { ParamsProps } from '@/types/api/Requests/ParamsProps.type';
import { createQueryString } from '@/utils/createQueryString';
import { ApiTypes, ViewTypes } from '@/types';
import { AxiosError } from 'axios';

const BASE_URL = '/BillingNotifications';

const fetcher = async (url: string) => axiosInstance.get(url).then(resp => resp.data);

const useGetBillingNotifications = (params: ParamsProps): ViewTypes.QueryData<ApiTypes.BillingNotificationsResponse> => {
  return useSWR<any>(`${BASE_URL}/?${createQueryString(params)}`, fetcher,
  {
    onErrorRetry: (error: AxiosError, key, config, revalidate, { retryCount }) => {
      if (error.response?.status === 403) return; 
      if (retryCount >= 2) return; 
    },
  });
};

export { useGetBillingNotifications };