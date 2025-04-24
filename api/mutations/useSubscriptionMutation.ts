import { axiosInstance } from '../axiosConfig';
import useSWRMutation from 'swr/mutation';

const SUBSCRIPTION_URL = '/Subscriptions';

const useSubscriptionMutation = () => {
  const pauseSubscriptionFetcher = (url: string, { arg }: { arg: { subscriptionId: string } }) => {
    return axiosInstance.put(`${SUBSCRIPTION_URL}/${arg.subscriptionId}/pause`, arg);
  };

  const unpauseSubscriptionFetcher = (url: string, { arg }: { arg: { subscriptionId: string; dueDate: string } }) => {
    return axiosInstance.put(`${SUBSCRIPTION_URL}/${arg.subscriptionId}/unpause`, arg);
  };

  const deactivateSubscriptionFetcher = (url: string, { arg }: { arg: { subscriptionId: string } }) => {
    return axiosInstance.put(`${SUBSCRIPTION_URL}/${arg.subscriptionId}/deactivate`, arg);
  };

  const pauseSubscription = useSWRMutation('subscription-pause', pauseSubscriptionFetcher);
  const unpauseSubscription = useSWRMutation('subscription-unpause', unpauseSubscriptionFetcher);
  const deactivateSubscription = useSWRMutation('subscription-deactivate', deactivateSubscriptionFetcher);

  return {
    pauseSubscription,
    unpauseSubscription,
    deactivateSubscription,
  };
};

export default useSubscriptionMutation;
