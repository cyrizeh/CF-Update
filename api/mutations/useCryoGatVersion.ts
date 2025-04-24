import axios from 'axios';
import useSWRMutation from 'swr/mutation';

const BASE_URL = '/v2/Version';

export const axiosInstanceReader = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_DEV_SCANNER_URL,
});

const useCryoGatVersion = () => {
  const getCryoGattVersionFetcher = (url: string) => {
    return axiosInstanceReader.get(`${BASE_URL}`);
  };

  const getCryoGattVersion = useSWRMutation('getCryoGattVersion', getCryoGattVersionFetcher);

  return { getCryoGattVersion };
};

export default useCryoGatVersion;
