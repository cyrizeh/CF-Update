import { ApiTypes } from '@/types';
import { axiosInstance } from '../axiosConfig';
import useSWRMutation from 'swr/mutation';

const INVENTORY_URL = '/Inventory/';
const DEVICE_KEY = 'device';
const CANE_KEY = 'cane';
const SPECIMEN_KEY = 'specimens';
const LOCATION_KEY = 'location';

const useInventoryMutation = () => {
  const updateCaneFetcher = (url: string, { arg }: { arg: ApiTypes.UpdateCaneRequest }) => {
    return axiosInstance.put(`${INVENTORY_URL}${CANE_KEY}/${arg.caneId}`, arg);
  };
  const createCaneFetcher = (url: string, { arg }: { arg: ApiTypes.CreateCaneRequest }) => {
    return axiosInstance.post(`${INVENTORY_URL}${CANE_KEY}`, arg);
  };
  const createCaneDiseaseFetcher = (url: string, { arg }: { arg: ApiTypes.CreateCaneDiseaseRequest }) => {
    return axiosInstance.put(`${INVENTORY_URL}${CANE_KEY}/${arg?.caneId}/disease`, arg);
  };
  const createSpecimenFetcher = (url: string, { arg }: { arg: ApiTypes.CreateSpecimenRequest }) => {
    return axiosInstance.post(`${SPECIMEN_KEY}`, arg);
  };
  const updateSpecimenFetcher = (url: string, { arg }: { arg: ApiTypes.UpdateSpecimenRequest }) => {
    return axiosInstance.put(`${SPECIMEN_KEY}/${arg?.id}`, arg);
  };
  const createDeviceFetcher = (url: string, { arg }: { arg: ApiTypes.CreateDevicesRequest }) => {
    return axiosInstance.post(`${INVENTORY_URL}${DEVICE_KEY}`, arg);
  };
  const updateDeviceFetcher = (url: string, { arg }: { arg: ApiTypes.UpdatedeviceRequest }) => {
    return axiosInstance.put(`${INVENTORY_URL}${DEVICE_KEY}/${arg?.id}`, arg);
  };
  const deleteDeviceFetcher = (url: string, { arg }: { arg: any }) => {
    return axiosInstance.delete(`${INVENTORY_URL}${DEVICE_KEY}/${arg.id}`);
  };
  const deleteCaneDeviceFetcher = (url: string, { arg }: { arg: any }) => {
    return axiosInstance.delete(`${INVENTORY_URL}${CANE_KEY}/${arg.id}`);
  };
  const deleteSpecimenFetcher = (url: string, { arg }: { arg: any }) => {
    return axiosInstance.delete(`${SPECIMEN_KEY}/${arg?.id}`);
  };
  const updateCaneLocationFetcher = (url: string, { arg }: { arg: ApiTypes.UpdateCaneLocationRequest }) => {
    return axiosInstance.put(`${INVENTORY_URL}${CANE_KEY}/${arg.caneId}/${LOCATION_KEY}`, arg);
  };
  const disposeCanesFetcher = (url: string, { arg }: { arg: ApiTypes.DisposeCanesRequest }) => {
    return axiosInstance.put(`${INVENTORY_URL}canes/dispose`, arg);
  };

  const disposeDevicesFetcher = (url: string, { arg }: { arg: ApiTypes.DisposeDevicesRequest }) => {
    return axiosInstance.put(`${INVENTORY_URL}device/dispose`, arg);
  };

  const addCaneNoteFetcher = (url: string, { arg }: { arg: { text: string; caneId: string } }) => {
    return axiosInstance.post(`${INVENTORY_URL}${CANE_KEY}/${arg?.caneId}/note`, arg);
  };

  const updateCaneNoteFetcher = (url: string, { arg }: { arg: { text: string; caneId: string; noteId: string } }) => {
    return axiosInstance.put(`${INVENTORY_URL}${CANE_KEY}/${arg?.caneId}/note/${arg?.noteId}`, arg);
  };
  const deleteCaneNoteFetcher = (url: string, { arg }: { arg: { caneId: string; noteId: string } }) => {
    return axiosInstance.delete(`${INVENTORY_URL}${CANE_KEY}/${arg?.caneId}/note/${arg?.noteId}`);
  };
  const updateRfidFetcher = (url: string, { arg }: { arg: ApiTypes.UpdateRfidRequest }) => {
    return axiosInstance.put(`${INVENTORY_URL}/${CANE_KEY}/${arg?.caneId}/rfid`, arg);
  };

  const deleteDevice = useSWRMutation(`${DEVICE_KEY}-delete`, deleteDeviceFetcher);
  const deleteSpecimen = useSWRMutation(`${DEVICE_KEY}-delete`, deleteSpecimenFetcher);
  const deleteCane = useSWRMutation(`${CANE_KEY}-delete`, deleteCaneDeviceFetcher);
  const createCane = useSWRMutation(`${CANE_KEY}-create`, createCaneFetcher);
  const createCaneDisease = useSWRMutation(`${CANE_KEY}-create-disease`, createCaneDiseaseFetcher);
  const updateCane = useSWRMutation(`${CANE_KEY}-update`, updateCaneFetcher);
  const createDevice = useSWRMutation(`${DEVICE_KEY}-create`, createDeviceFetcher);
  const updateDevice = useSWRMutation(`${DEVICE_KEY}-update`, updateDeviceFetcher);
  const createSpecimen = useSWRMutation(`${CANE_KEY}-create`, createSpecimenFetcher);
  const updateSpecimen = useSWRMutation(`${CANE_KEY}-create`, updateSpecimenFetcher);
  const updateCaneLocation = useSWRMutation(`${CANE_KEY}-update`, updateCaneLocationFetcher);
  const disposeCanes = useSWRMutation(`${CANE_KEY}-dispose`, disposeCanesFetcher);
  const disposeDevices = useSWRMutation(`${CANE_KEY}-dispose`, disposeDevicesFetcher);
  const addCaneNote = useSWRMutation(`${CANE_KEY}-create-note`, addCaneNoteFetcher);
  const updateCaneNote = useSWRMutation(`${CANE_KEY}-update-note`, updateCaneNoteFetcher);
  const deleteCaneNote = useSWRMutation(`${CANE_KEY}-delete-note`, deleteCaneNoteFetcher);
  const updateRfid = useSWRMutation(`${CANE_KEY}-rfid-update`, updateRfidFetcher);
  return {
    updateCane,
    createDevice,
    updateDevice,
    createCane,
    deleteDevice,
    deleteCane,
    deleteSpecimen,
    createSpecimen,
    updateSpecimen,
    updateCaneLocation,
    disposeCanes,
    disposeDevices,
    createCaneDisease,
    addCaneNote,
    updateCaneNote,
    deleteCaneNote,
    updateRfid,
  };
};
export default useInventoryMutation;
