import { ListResponse } from './ListResponse.type';
import { Clinic } from '../../view/Clinic.interface';

export interface ClinicsResponse extends ListResponse {
  items: Array<Clinic>;
}
