import { ApiTypes, ViewTypes } from '@/types';
import { ParamsProps } from '@/types/api/Requests/ParamsProps.type';
import { createQueryString } from '@/utils/createQueryString';
import useSWR from 'swr';
import { axiosInstance } from '../axiosConfig';

const BASE_URL = '/Notifications';
const buildGetNotificationsUrl = (params: ParamsProps) => `${BASE_URL}/?${createQueryString(params)}`;

const fetcher = async (url: string) => axiosInstance.get(url).then(resp => resp.data);

const useGetNotifications = (
  params: ParamsProps & { isRead: boolean },
  isEnabled = true
): ViewTypes.QueryData<ApiTypes.NotificationsResponse> => {
  return useSWR<ApiTypes.NotificationsResponse>(isEnabled ? buildGetNotificationsUrl(params) : null, fetcher);
};

export { useGetNotifications };
