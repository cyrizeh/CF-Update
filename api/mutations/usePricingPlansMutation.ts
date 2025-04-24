import { ApiTypes } from '@/types';
import useSWRMutation from 'swr/mutation';
import { axiosInstance } from '../axiosConfig';

const BASE_URL = '/PricingPlans';

const usePricingPlansMutation = () => {
  const createPricingPlanFetcher = (url: string, { arg }: { arg: ApiTypes.PricingPlanRequest }) => {
    return axiosInstance.post(BASE_URL, arg);
  };

  const createPricingPlan = useSWRMutation('createPricingPlan', createPricingPlanFetcher);

  const updatePricingPlanNameFetcher = (url: string, { arg }: { arg: { name: string; pricingPlanId: string } }) => {
    return axiosInstance.put(`${BASE_URL}/${arg?.pricingPlanId}`, arg);
  };

  const updatePricingPlanName = useSWRMutation('updatePricingPlanName', updatePricingPlanNameFetcher);

  return {
    createPricingPlan,
    updatePricingPlanName,
  };
};

export default usePricingPlansMutation;
