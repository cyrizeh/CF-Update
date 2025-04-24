import useSWRMutation from 'swr/mutation';
import { ApiTypes } from '@/types';
import { axiosInstance } from '../axiosConfig';

const useFacilityMutation = () => {
  const createFacilityFetcher = (url: string, { arg }: { arg: ApiTypes.CreateFacilityRequest }) => {
    return axiosInstance.post('/Facilities', arg);
  };

  const updateFacilityFetcher = (
    url: string,
    { arg }: { arg: ApiTypes.CreateFacilityRequest & { facilityId: string } }
  ) => {
    return axiosInstance.put(`/Facilities/${arg?.facilityId}`, arg);
  };

  const createInventoryFetcher = (url: string, { arg }: { arg: ApiTypes.CreateInventoryRequest }) => {
    return axiosInstance.post('/Inventory/Vault', arg);
  };

  const createTankFetcher = (url: string, { arg }: { arg: ApiTypes.CreateTankRequest }) => {
    return axiosInstance.post('/Inventory/Tank', arg);
  };

  const deleteVaultFetcher = (url: string, { arg }: { arg: any }) => {
    return axiosInstance.delete(`/Inventory/vault/${arg.id}`);
  };

  const deleteTankFetcher = (url: string, { arg }: { arg: any }) => {
    return axiosInstance.delete(`/Inventory/tank/${arg.id}`);
  };

  const deleteFacilityFetcher = (url: string, { arg }: { arg: any }) => {
    return axiosInstance.delete(`/Facilities/${arg.id}`);
  };

  const updateTankFetcher = (url: string, { arg }: { arg: { id: string; tankName: string } }) => {
    return axiosInstance.put(`/Inventory/Tank/${arg.id}`, arg);
  };

  const createFacility = useSWRMutation('facility', createFacilityFetcher);

  const updateFacility = useSWRMutation('facility', updateFacilityFetcher);

  const createInventory = useSWRMutation('vault', createInventoryFetcher);

  const createTank = useSWRMutation('tank', createTankFetcher);

  const deleteVault = useSWRMutation('vault', deleteVaultFetcher);

  const deleteTank = useSWRMutation('tank', deleteTankFetcher);

  const deleteFacility = useSWRMutation('facility', deleteFacilityFetcher);

  const updateTank = useSWRMutation('tank-update', updateTankFetcher);

  return {
    createFacility,
    createInventory,
    createTank,
    deleteVault,
    deleteTank,
    deleteFacility,
    updateTank,
    updateFacility,
  };
};

export default useFacilityMutation;
