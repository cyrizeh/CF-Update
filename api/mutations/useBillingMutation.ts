import { ApiTypes } from '@/types';
import { AxiosResponse } from 'axios';
import useSWRMutation from 'swr/mutation';
import { axiosInstance } from '../axiosConfig';

const BASE_URL = '/Payments';
const buildBillingsExportUrl = () => `${BASE_URL}/export`;

const useBillingsMutation = () => {
  const exportBillingsFetcher = (
    url: string,
    { arg }: { arg: ApiTypes.BillingExportRequest }
  ): Promise<AxiosResponse<string>> => {
    return axiosInstance.post(buildBillingsExportUrl(), arg);
  };

  const handleExportBillings = useSWRMutation('billingsExport', exportBillingsFetcher);

  return { handleExportBillings };
};

export default useBillingsMutation;
