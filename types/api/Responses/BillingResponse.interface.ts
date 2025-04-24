import { ListResponse } from './ListResponse.type';
import { BillingProps } from '@/types/view/Billing.interface';

export interface BillingResponse extends ListResponse {
  items: Array<BillingProps>;
}
