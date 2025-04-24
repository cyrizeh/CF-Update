import { ListResponse } from './ListResponse.type';
import { TerminationRequest } from '@/types/view/TerminationRequest.interface';

export interface TerminationResponse extends ListResponse {
  items: Array<TerminationRequest>;
}
