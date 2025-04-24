import useSWR from 'swr';
import { axiosInstance } from '../axiosConfig';

const BASE_URL = '/Users';

const fetcher = async (url: string) => axiosInstance.get(url).then(resp => resp.data);

const useGetUsers = () => {
  return useSWR<any>(`${BASE_URL}`, fetcher);
};

export { useGetUsers };
