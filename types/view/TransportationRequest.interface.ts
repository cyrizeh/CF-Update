import { Patient } from './Patient.interface';
import { TransportationDetails } from './TransportationDetails.type';

export interface TransportationRequest {
  id: string;
  created: string;
  status: string;
  creationStep: string;
  patientId: string;
  patient: Patient;
  facilityId: string;
  account: string;
  orderNumber: string;
  paymentAmount: number;
  payer: string;
  sendingClinic: ClinicInfo;
  receivingClinic: ClinicInfo;
  transportationDetails: TransportationDetails;
  shipmentSentDate: string;
  shipmentReceivedDate: string;
  specimenDetails: SpecimenInfo;
  shipperNumber: string;
  paymentStatus: string;
  sendingClinicName: string;
  receivingClinicName: string;
  transportationStatuses: string[];
  partnerId?: string;
}

type ClinicInfo = {
  name: string;
  contactDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    jobTitle: string;
  };
  address: {
    street1: string;
    street2: string;
    city: string;
    state: string;
    zipCode: string;
  };
};

type SpecimenInfo = {
  numberOfCanes: number;
  numberOfDevices: number;
  specimenTypes: string[];
  diseaseReportPath: string;
};
