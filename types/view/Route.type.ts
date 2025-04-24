import { AdminRoute } from '../AdminRoute.enum';
import { PatientRoute } from '../PatientRoute.enum';
import { ClinicRoute } from '../ClinicRoute.enum';
import { AccountRoute } from '../AccountRoute.enum';

export type Route =  AdminRoute | PatientRoute | ClinicRoute |AccountRoute;
