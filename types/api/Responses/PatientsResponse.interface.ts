import { ListResponse } from './ListResponse.type';
import { Patient } from '../../view/Patient.interface';

export interface PatientsResponse extends ListResponse {
  items: Array<Patient>;
}

