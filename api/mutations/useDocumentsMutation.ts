import useSWRMutation from 'swr/mutation';
import { axiosInstance } from '../axiosConfig';

export const useDocumentsMutation = () => {
  const startDocumentSigningFetcher = (url: string, { arg }: { arg: any }) => {
    return axiosInstance.post(`/Patients/StartDocumentSigning`, arg).then(resp => resp.data);
  };

  const { data, trigger, isMutating, error } = useSWRMutation('DocumentSigning', startDocumentSigningFetcher);
  return { data, trigger, isMutating, error };
};

export const useCompleteDocumentSigningMutation = (onboardingStepId: string) => {
  const completeDocumentSigningFetcher = (url: string, { arg }: { arg: any }) => {
    return axiosInstance.post(`/Patients/Onboarding/${onboardingStepId}`, arg).then(resp => resp.data);
  };

  const { data, trigger, isMutating, error } = useSWRMutation('CompleteSigning', completeDocumentSigningFetcher);
  return { data, trigger, isMutating, error };
};

export const useToggleStatusMutation =() => {
  const toggleStatusFetcher = (url: string, { arg }: { arg: any }) => {
    return axiosInstance.post(`/Documents/${arg}/ToggleStatus`, arg);
  };

  const { data, trigger, isMutating, error }  = useSWRMutation('ToggleStatus', toggleStatusFetcher);
  return { data, trigger, isMutating, error };
};





