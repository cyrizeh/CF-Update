import useSWRMutation from 'swr/mutation';
import { ApiTypes } from '@/types';
import { axiosInstance } from '../axiosConfig';

const BASE_URL = '/Notifications';

const useNotificationMutation = () => {
  const updateNotificationFetcher = (url: string, { arg }: { arg: ApiTypes.UpdateNotificationRequest }) => {
    return axiosInstance.put(`${BASE_URL}/${arg.notificationId}/markAsRead`);
  };

  const updateNotification = useSWRMutation('updateNotification', updateNotificationFetcher);

  return { updateNotification };
};

export default useNotificationMutation;
