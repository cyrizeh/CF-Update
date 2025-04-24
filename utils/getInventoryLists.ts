import { axiosInstance } from '@/api/axiosConfig';

import { Dispatch, SetStateAction } from 'react';

export type ItemList = { id: string; name: string };

export const changeCanistersLib = async (id: string, canisters: any, setCaneList: any) => {
  const canisterIndex = canisters.findIndex((item: any) => item.id === id);
  const newCanesList = canisters[canisterIndex]?.canes;
  setCaneList(newCanesList);
};

export const changeFacilityLib = async (id: string, setVaultList: any) => {
  try {
    const { data: vaults } = await axiosInstance.get(`/Inventory/vault?FacilityId=${id}`);
    if (vaults) {
      const newVaultList = vaults?.items;
      setVaultList(newVaultList);
    }
  } catch (err) {
    throw new Error();
  }
};

export const changePiesLib = async (id: string, pies: any, setCanisterList: any) => {
  const pieIndex = pies.findIndex((item: any) => item.id === id);
  const newCanistersList = pies[pieIndex]?.canisters || [];
  setCanisterList(newCanistersList);
};

export const changeTankLib = async (
  id: string,
  changePiesList: any,
  changeCanistersList: Dispatch<SetStateAction<ItemList[]>>
) => {
  try {
    const { data: pies } = await axiosInstance.get(`/Inventory/tank?tankId=${id}`);
    // Filter canisters which does not have free slots
    if (pies.canisters) {
      const filteredCanisters = pies?.canisters?.filter((canister: any) => canister.canes && canister.canes.length > 0);
      changeCanistersList(filteredCanisters);
      return changePiesList([]);
    }

    const filteredPies = pies.pies
      ? pies.pies
          .map((pie: any) => {
            const filteredCanisters = pie.canisters.filter(
              (canister: any) => canister.canes && canister.canes.length > 0
            );
            return filteredCanisters.length > 0 ? { ...pie, canisters: filteredCanisters } : null;
          })
          .filter(Boolean)
      : [];

    changePiesList(filteredPies);
  } catch (err) {
    throw new Error();
  }
};

export const changeVaultLib = async (id: string, vaults: any, setTanksList: any) => {
  const vaultIndex = vaults.findIndex((item: any) => item.id === id);
  const newTankList = vaults[vaultIndex]?.tanks?.map((item: any) => {
    return { id: item.id, name: item.name };
  });
  setTanksList(newTankList || []);
};
