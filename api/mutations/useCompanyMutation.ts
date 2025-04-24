import useSWRMutation from 'swr/mutation';
import { ApiTypes } from '@/types';
import { axiosInstance } from '../axiosConfig';

const useCompanyMutation = () => {
  const createCompanyFetcher = (url: string, { arg }: { arg: ApiTypes.CreateClinicRequest }) => {
    return axiosInstance.post('/company', arg);
  };

  const createCompany = useSWRMutation('clinic', createCompanyFetcher);

  return { createCompany };
};

export default useCompanyMutation;
