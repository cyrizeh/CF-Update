import { ListResponse } from './ListResponse.type';
import { Facility } from '../../view/Facility.interface';

export interface FacilityResponse extends ListResponse {
  items: Array<Facility>;
}
