import useSWRMutation from 'swr/mutation';
import { ApiTypes } from '@/types';
import { axiosInstance } from '../axiosConfig';

const useTransfersMutation = () => {
  const transfersToClinicFetcher = (url: string, { arg }: { arg: ApiTypes.CreateTransfersToClinicRequest }) => {
    return axiosInstance.post('/Transfers/toClinic', arg);
  };

  const returnToLocationFetcher = (url: string, { arg }: { arg: ApiTypes.ReturnCanesToLocationRequest}) => {
    return axiosInstance.post(`/Transfers/toClinic/${arg.transferId}/returnToLocation`, arg);
  };

  const updateTransferStatusFetcher = (url: string, { arg }: { arg: ApiTypes.UpdateTransferStatusRequest }) => {
    return axiosInstance.put(`/Transfers/toClinic/${arg.transferId}/status`, arg);
  };

  const updateLocationTransferStatusFetcher = (url: string, { arg }: { arg: ApiTypes.UpdateTransferStatusRequest }) => {
    return axiosInstance.put(`/Transfers/toLocation/${arg.transferId}/status`, arg);
  };

  const updateCaneLocationFetcher = (url: string, { arg }: { arg: ApiTypes.UpdateCaneLocationRequest }) => {
    return axiosInstance.post(`/Transfers/toClinic/${arg.transferId}/stayAtClinic`, arg);
  };

  const thawCaneFetcher = (url: string, { arg }: { arg: ApiTypes.ThawCaneRequest }) => {
    return axiosInstance.post(`/Transfers/toClinic/${arg.transferId}/markAsThawed`, arg);
  };

  const confirmArrivalFetcher = (url: string, { arg }: { arg: ApiTypes.UpdateCaneLocationRequest }) => {
    return axiosInstance.post(`/Transfers/toLocation/${arg.transferId}/confirmArrival`, arg);
  };

  const { trigger: transfersToClinic }= useSWRMutation('transfersToClinic', transfersToClinicFetcher);

  const { trigger: returnCanesToLocation }= useSWRMutation('returnToLocation', returnToLocationFetcher);

  const { trigger: updateTransferStatus }= useSWRMutation('updateTransferStatus', updateTransferStatusFetcher);

  const { trigger: updateLocationTransferStatus }= useSWRMutation('updateTransferStatus', updateLocationTransferStatusFetcher);

  const { trigger: updateCaneLocation }= useSWRMutation('updateCaneLocation', updateCaneLocationFetcher);
  
  const { trigger: thawCane }= useSWRMutation('thawCane', thawCaneFetcher);

  const { trigger: confirmArrival }= useSWRMutation('thawCane', confirmArrivalFetcher);

  return { transfersToClinic, returnCanesToLocation, updateTransferStatus,
    updateLocationTransferStatus, updateCaneLocation, thawCane, confirmArrival };
};

export default useTransfersMutation;


