import { FilterType } from '@/types/view/Filters.type';

export type ParamsProps = {
  q?: string;
  id?: string;
  pageSize?: number;
  sort?: string;
  pageNumber?: number;
  SubscriptionStatus?: string;
  NextPaymentDate?: string;
  filters?: {
    [key: string]: FilterType;
  };
  patientId?: string;
  transportationRequestId?: string;
  status?: string;
};
