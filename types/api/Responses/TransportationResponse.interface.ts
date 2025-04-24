import { TransportationRequest } from '@/types/view';
import { ListResponse } from './ListResponse.type';

export interface TransportationResponse extends ListResponse {
  items: Array<TransportationRequest>;
}

