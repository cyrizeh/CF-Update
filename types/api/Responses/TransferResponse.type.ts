import { ListResponse } from './ListResponse.type';
import { Transfer } from '../../view/Transfer.interface';

export interface TransferResponse extends ListResponse {
  items: Array<Transfer>;
}
