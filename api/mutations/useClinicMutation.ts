import useSWRMutation from 'swr/mutation';
import { ApiTypes } from '@/types';
import { axiosInstance } from '../axiosConfig';

const useClinicMutation = () => {
  const createClinicFetcher = (url: string, { arg }: { arg: ApiTypes.CreateClinicRequest }) => {
    return axiosInstance.post('/Clinics', arg);
  };

  const updateClinicDetails = (url: string, { arg }: { arg: ApiTypes.UpdateClinicRequest }) => {
    return axiosInstance.put(`/Clinics/${arg.clinicId}`, arg);
  };

  const updateClinicAddressFetcher = async (url: string, { arg }: { arg: ApiTypes.UpdateClinicAddressRequest }) => {
    return axiosInstance.put(`/Clinics/${arg.clinicId}/address`, arg);
  };

  const updateClinicBillingFetcher = async (url: string, { arg }: { arg: any }) => {
    return axiosInstance.put(`/Clinics/${arg.clinicId}/PricingPlan`, arg);
  };

  const addToFavoritesFetcher = async (url: string, { arg }: { arg: { clinicId: string }}) => {
    return axiosInstance.put(`/Clinics/${arg.clinicId}/favorite`, arg);
  };

  const deleteFromFavoritesFetcher = async (url: string, { arg }: { arg: any}) => {
    return axiosInstance.delete(`/Clinics/${arg.clinicId}/favorite`, arg);
  };

  const paymentDateSourceFetcher = async (url: string, { arg }: { arg: { clinicId: string, paymentDateSource:string }}) => {
    return axiosInstance.put(`/Clinics/${arg.clinicId}/paymentDateSource`, arg);
  };

  const { trigger: updatepaymentDateSource }= useSWRMutation('paymentDateSource', paymentDateSourceFetcher);

  const createClinic = useSWRMutation('clinic', createClinicFetcher);

  const { data: updatedClinicData, trigger: updateDetails } = useSWRMutation('clinic', updateClinicDetails);

  const { data: updatedClinicAddress , trigger: updateClinicAddress, isMutating: isClinicAddressMutating } = useSWRMutation('address', updateClinicAddressFetcher);

  const updateClinicBilling = useSWRMutation('billing', updateClinicBillingFetcher);

  const { trigger: addToFavorites }= useSWRMutation('addfavorite', addToFavoritesFetcher);

  const { trigger: deleteFromFavorites } = useSWRMutation('deletefavorite', deleteFromFavoritesFetcher);

  return { updatedClinicData, updatedClinicAddress, createClinic, updateDetails, updateClinicAddress, updateClinicBilling, isClinicAddressMutating, addToFavorites, deleteFromFavorites, updatepaymentDateSource};
};

export default useClinicMutation;
