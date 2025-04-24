import { BillingNotification } from '@/types/view/BillingNotification.interface';
import { ListResponse } from './ListResponse.type';

export interface BillingNotificationsResponse extends ListResponse {
  items: Array<BillingNotification>;
}