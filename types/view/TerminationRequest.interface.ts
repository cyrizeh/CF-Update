export interface TerminationRequest {
  id: string;
  patientId: string;
  patient: {
    id: string;
    referenceId: string;
    email: string;
    firstName: string;
    middleName: string;
    lastName: string;
    fullName: string;
    firstAndLast: string;
    dateOfBirth: string | null;
    patientType: string | null;
  };
  requestedDate: string;
  terminationStatuses: string[];
  notes: string | null;
  created: string;
  facilityId: string;
  facilityName: string;
  clinicId: string;
  clinicName: string;
  specimenTypes: string[];
  specimenTerminations: {
    id: string;
    terminationRequestId: string;
    specimenType: string;
    terminationType: string;
    specimenTerminationQty: string;
    fileName: string;
    requestFile: {
      id: string;
      fileName: string;
    };
    notarizedFile: {
      id: string;
      fileName: string;
    } | null;
  } [];
}
