import useSWRMutation from 'swr/mutation';
import { ApiTypes } from '@/types';
import { axiosInstance } from '../axiosConfig';

const BASE_URL = '/TerminationRequests';

const useTerminationsMutation = () => {
  const cancelTerminatinRequestFetcher = (url: string, { arg }: { arg: {id:string} }) => {
    return axiosInstance.put(`${BASE_URL}/${arg.id}/cancel`, arg);
  };

  const { trigger: cancelTerminatinRequest}= useSWRMutation('cancelRequest', cancelTerminatinRequestFetcher);

  const updateRequestStatusFetcher = (url: string, { arg }: { arg: ApiTypes.UpdateTerminationStatusRequest }) => {
    return axiosInstance.put(`${BASE_URL}/${arg.terminationRequestId}/status`, arg);  
  };

  const { trigger: updateRequestStatus } = useSWRMutation('updateRequestStatus', updateRequestStatusFetcher);

  const addTerminationNoteFetcher = (url: string, { arg }: { arg: { terminationRequestId: string; notes: string } }) => {
    return axiosInstance.put(`${BASE_URL}/${arg.terminationRequestId}/notes`, { ...arg });
  };
  
  const { trigger: addTerminationNote } = useSWRMutation('addTerminationNote', addTerminationNoteFetcher);
  
  return { cancelTerminatinRequest, updateRequestStatus, addTerminationNote };
};

export default useTerminationsMutation;


