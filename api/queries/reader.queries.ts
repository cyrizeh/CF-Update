import { ViewTypes } from '@/types';
import axios from 'axios';
import useSWR from 'swr';

export const axiosInstanceReader = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_DEV_SCANNER_URL,
});

const BASE_URL = '/v2/Readers';
const VERSION_URL = '/v2/Version';
const fetcher = async (url: string) => axiosInstanceReader.get(url).then(resp => resp.data);

const useGetReaders = (isFetch = true) => {
  return useSWR<any>(isFetch ? `${BASE_URL}` : null, fetcher);
};

const useGetCryoGattVersion = (isFetch = true): ViewTypes.QueryData<{ Major: number; Minor: number }> => {
  return useSWR<{ Major: number; Minor: number }>(isFetch ? `${VERSION_URL}` : null, fetcher);
};

export { useGetReaders, useGetCryoGattVersion };
