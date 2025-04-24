import useSWRMutation from 'swr/mutation';
import { axiosInstance } from '../axiosConfig';
import { ApiTypes } from '@/types';

const BASE_URL = '/PickList';
const BASE_URL_INVENTORY = '/Inventory';
const usePickListMutation = () => {
  const withDrawPickListFetcher = (url: string, { arg }: { arg: { pickListId: string; caneId: string } }) => {
    return axiosInstance.put(`${BASE_URL}/${arg.pickListId}/cane/${arg.caneId}/withdrawn`);
  };

  const withDrawPickList = useSWRMutation('withDrawPickList', withDrawPickListFetcher);

  const deleteCaneFromPickListFetcher = (url: string, { arg }: { arg: { pickListId: string; caneId: string } }) => {
    return axiosInstance.delete(`${BASE_URL}/${arg.pickListId}/cane/${arg.caneId}/delete`);
  };

  const deleteCaneFromPickList = useSWRMutation('withDrawPickList', deleteCaneFromPickListFetcher);

  const assignPickListFetcher = (url: string, { arg }: { arg: { pickListId: string } }) => {
    return axiosInstance.put(`${BASE_URL}/${arg.pickListId}/assign`);
  };

  const assignPickList = useSWRMutation('assignPickListFetcher', assignPickListFetcher);

  const deletePickListFetcher = (url: string, { arg }: { arg: { pickListId: string } }) => {
    return axiosInstance.delete(`${BASE_URL}/${arg.pickListId}`);
  };

  const deletePickList = useSWRMutation('deletePickList', deletePickListFetcher);

  const assignPickListToAdminFetcher = (
    url: string,
    { arg }: { arg: { pickListId: string; adminPickListId: string } }
  ) => {
    return axiosInstance.put(`${BASE_URL}/${arg.pickListId}/assign/${arg?.adminPickListId}`);
  };

  const assignPickToAdminList = useSWRMutation('assignPickToAdminList', assignPickListToAdminFetcher);

  const updateCaneLocationFetcher = (url: string, { arg }: { arg: ApiTypes.AddCaneLocationRequest }) => {
    return axiosInstance.put(`${BASE_URL_INVENTORY}/cane/${arg.caneId}/addLocation/${arg.slotId}`, arg);
  };
  const updateCaneLocation = useSWRMutation(`updateCaneLocation`, updateCaneLocationFetcher);
  return {
    withDrawPickList,
    assignPickList,
    deletePickList,
    assignPickToAdminList,
    deleteCaneFromPickList,
    updateCaneLocation,
  };
};

export default usePickListMutation;
