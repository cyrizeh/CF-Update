import { ListResponse } from './ListResponse.type';
import { Cane, Specimen } from '../../view/Specimen.interface';

export interface SpecimensResponse extends ListResponse {
  items: Array<Specimen>;
}

export interface CanesResponse extends ListResponse {
  items: Array<Cane>;
}
