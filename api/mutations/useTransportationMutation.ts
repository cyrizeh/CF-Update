import useSWRMutation from 'swr/mutation';
import { ApiTypes } from '@/types';
import { axiosInstance } from '../axiosConfig';

const BASE_URL = '/Transportations';

export type UpdateTransportationStatusRequest = {
  transportationStatuses: string[];
  transportationRequestId: string;
};

const useTransportationMutation = () => {
  const updateTransportationDetails = (url: string, { arg }: { arg: ApiTypes.UpdateTransportationDetailsRequest }) => {
    return axiosInstance.put(`${BASE_URL}/${arg.transportationRequestId}/TransportationDetails`, arg);
  };

  const { data: updatedRequest, trigger: updateRequest } = useSWRMutation(
    'updateTransportationRequest',
    updateTransportationDetails
  );

  const updateTransportationStatus = (url: string, { arg }: { arg: UpdateTransportationStatusRequest }) => {
    return axiosInstance.put(`${BASE_URL}/${arg.transportationRequestId}/Status`, arg);
  };

  const deleteTransportationRequestFetcher = (url: string, { arg }: { arg: { transportationRequestId: string } }) => {
    return axiosInstance.delete(`${BASE_URL}/${arg.transportationRequestId}/Draft`);
  };

  const { trigger: updateRequestStatus } = useSWRMutation('updateStatusRequest', updateTransportationStatus);
  const deleteTransportationRequest = useSWRMutation('updateStatusRequest', deleteTransportationRequestFetcher);

  const addTransportationNoteFetcher = (url: string, { arg }: { arg: { transportationRequestId: string; text: string } }) => {
    return axiosInstance.post(`${BASE_URL}/${arg.transportationRequestId}/note`, { ...arg });
  };

  const addTransportationNote = useSWRMutation('addTransportationNote', addTransportationNoteFetcher);

  return { updatedRequest, updateRequest, updateRequestStatus, deleteTransportationRequest, addTransportationNote };
};

export default useTransportationMutation;
