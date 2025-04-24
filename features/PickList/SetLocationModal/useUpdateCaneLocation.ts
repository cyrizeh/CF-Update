import { axiosInstance } from '@/api/axiosConfig';
import { useGetFacilities } from '@/api/queries/facility.queries';
import { ViewTypes } from '@/types';
import { Facility } from '@/types/view/Facility.interface';
import { changeCanistersLib, changeFacilityLib, changePiesLib, changeTankLib, changeVaultLib } from '@/utils/getInventoryLists';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

export type ItemList = { id: string; name: string };
export type PieList = { id: string; color: string };

const useUpdateCaneLocation = (isOpen: boolean) => {
  const { data: facilities } = useGetFacilities({});
  const [facilitiesList, setFacilitiesList] = useState<Facility[]>([]);
  const [vaultList, setVaultList] = useState<ItemList[]>([]);
  const [tankList, setTankList] = useState<ItemList[]>([]);
  const [piesList, setPiesList] = useState<PieList[]>([]);
  const [canisterList, setCanisterList] = useState<ItemList[]>([]);
  const [caneList, setCaneList] = useState<{ id: string; number: string }[]>([]);

  const { setValue } = useFormContext<ViewTypes.UpdateCaneLocationFormValues>();

  const clearAllListsWithOutfacilities = () => {
    setVaultList([]);
    setTankList([]);
    setPiesList([]);
    setCanisterList([]);
    setCaneList([]);

    setValue('vaultId', '');
    setValue('tankId', '');
    setValue('pieId', '');
    setValue('canisterId', '');
    setValue('slotId', '');
  };

  const clearListsFromVault = () => {
    setTankList([]);
    setPiesList([]);
    setCanisterList([]);
    setCaneList([]);

    setValue('tankId', '');
    setValue('pieId', '');
    setValue('canisterId', '');
    setValue('slotId', '');
  };

  const clearListsFromTank = () => {
    setPiesList([]);
    setCanisterList([]);
    setCaneList([]);

    setValue('pieId', '');
    setValue('canisterId', '');
    setValue('slotId', '');
  };

  const clearListsFromPie = () => {
    setCanisterList([]);
    setCaneList([]);

    setValue('canisterId', '');
    setValue('slotId', '');
  };

  const clearListsFromCanister = () => {
    setCaneList([]);

    setValue('slotId', '');
  };

  const fetchInitData = async (
    facilityId: string,
    tankId: string,
    vaultId: string,
    canisterId: string,
    pieId: string
  ) => {
    if (facilityId && tankId) {
      let newCanistersList;
      try {
        const { data: vaults } = await axiosInstance.get(`/Inventory/vault?FacilityId=${facilityId}`);
        if (vaults) {
          const newVaultList = vaults?.items;
          setVaultList(newVaultList);
          const vaultIndex = newVaultList.findIndex((item: any) => item.id === vaultId);
          const newTankList = newVaultList[vaultIndex]?.tanks?.map((item: any) => {
            return { id: item.id, name: item.name };
          });
          setTankList(newTankList || []);
        }
      } catch (err) {
        throw new Error();
      }
      try {
        const { data: pies } = await axiosInstance.get(`/Inventory/tank?tankId=${tankId}`);
        if (pies.canisters) {
          newCanistersList = pies.canisters;
          setPiesList([]);
        } else {
          setPiesList(pies?.pies || []);
          const pieIndex = pies?.pies.findIndex((item: any) => item.id === pieId);
          newCanistersList = pies?.pies[pieIndex]?.canisters || [];
        }
        setCanisterList(newCanistersList);
        const canisterIndex = newCanistersList.findIndex((item: any) => item.id === canisterId);
        const newCanesList = newCanistersList[canisterIndex]?.canes;
        setCaneList(newCanesList);
      } catch (err) {
        throw new Error();
      }
    } else {
      try {
        const { data: vaults } = await axiosInstance.get(`/Inventory/vault?FacilityId=${facilityId}`);
        if (vaults) {
          const newVaultList = vaults?.items;
          setVaultList(newVaultList);
        }
      } catch (err) {
        throw new Error();
      }
    }
  };
  // Change form Lists
  const changeFacilityId = (value: string) => {
    changeFacilityLib(value, setVaultList);
    clearAllListsWithOutfacilities(); // Reset Facility-related lists
  };
  const changeVault = (value: string) => {
    clearListsFromVault(); // Reset Vault-related lists
    changeVaultLib(value, vaultList, setTankList);
  };

  const changeTank = async (value: string) => {
    clearListsFromTank(); // Reset Tank-related lists
    changeTankLib(value, setPiesList, setCanisterList);
  };

  const changePies = (value: string) => {
    clearListsFromPie(); // Reset Pies-related lists
    changePiesLib(value, piesList, setCanisterList);
  };

  const changeCanister = (value: string) => {
    clearListsFromCanister(); // Reset Canister-related lists
    changeCanistersLib(value, canisterList, setCaneList);
  };

  //use Effects

  useEffect(() => {
    if (facilities) {
      setFacilitiesList(facilities?.items);
    }
  }, [facilities]);

  useEffect(() => {
    if (!isOpen) {
      clearAllListsWithOutfacilities();
    }
  }, [isOpen]);

  return {
    facilitiesList,
    vaultList,
    tankList,
    piesList,
    canisterList,
    caneList,
    changeFacilityId,
    changeVault,
    changeTank,
    changeCanister,
    changePies,
    fetchInitData,
    setCaneList,
  };
};

export default useUpdateCaneLocation;
