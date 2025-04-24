import { LocationStatus } from '@/constants/specimens';
import { Patient } from './Patient.interface';

export interface Specimen {
  locationStatus?: LocationStatus;
  caneId?: string;
  id: string;
  specimenType: string;
  numberOfStraws: number;
  numberOfCanes: number;
  freezeDate: string;
  idLabResult: string;
  patient: Patient;
  clinicName: string;
  facilityName: string;
  facilityId: string;
  vault: string | null;
  tank: string | null;
  canister: string | null;
  pie: string | null;
  cane: string | null;
  rfid: string | null;
  isPresent: boolean | null;
  dateOfThaw: string | null;
  pgtResults: string | null;
  usedFor: string | null;
  notes: string | null;
  isDonor: boolean | null;
  donor: string | null;
  donorOocyte: boolean;
  donorEmbryo: boolean;
  donorSperm: boolean;
  location: string;
  processed: boolean;
}

export interface DonorData {
  id: string;
  name: string;
  dateOfBirth: string;
  patientId: string | null;
}

export interface SpecimanDetailsByCane extends Specimen {
  numberDescription?: string | null;
  color?: string | null;
  pgtResults: string | null;
  receiptDate: string | null;
  spermDonorId: string | null;
  spermDonor: DonorData;
  oocyteDonor: DonorData;
  oocyteDonorId: string | null;
  embryoDonor: DonorData;
  embryoDonorId: string;
  expectedSpecimenQty?: string;
  gradeMaturity?: string;
  embryoOocyteNumber?: string;
  quantity?: number;
  isDonorOocyte?: boolean;
  isDonorSperm?: boolean;
  type?: string;
}

export interface CaneDetails extends Specimen {
  pickListId: string;
  slotId: string;
  createdAt?: string | null;
  devices: SpecimanDetailsByCane[] | null;
  number?: string | null;
  caneDescription?: string | null;
  patientClinicId: string;
  clinicId: string;
  patientClinicName: string;
  patientId: string;
  clinicType: string;
  clinicContactDetails: string;
  disposeAneuploidConsent: boolean | null;
  abandonedTissue: boolean | null;
  keepAneuploid: boolean | null;
  allAneuploidEmbryoStatus: string | null;
  cycleNumber: string | null;
  canisterId: string | null;
  expectedDeviceQty: number | null;
  numberOfSpecimens: number | null;
  caneLabel: string;
  notes: string;
  disposedAt: string | null;
  disposedBy: string | null;
  processed: boolean;
  receiptDate: string | null;
  deviceNumber: number;
  caneColor: string;
  primaryIdentifier: {
    id: string;
    email: string;
  };
  secondaryIdentifier: {
    id: string;
    email: string;
  };
  fdaEligibility: any;
  reactivity: boolean;
  reactiveStatus: any;
}
export interface DetailsTitle {
  locationTitle: string;
  caneTitle: string;
  noteTitle: string;
  patientTitle: string;
  strawVialTitle: string;
  generalInformationTitle: string;
  generalClinicInformationTitle: string;
  statusTitle: string;
}

export interface Cane {
  id: string;
  created: string;
  lastModified: string;
  patientId: string;
  patient: Patient;
  rfid: string;
  facilityId: string;
  facilityName: string;
  clinicId: string;
  clinicName: string;
  accountId: string;
  vault: string;
  tank: string;
  pie: string;
  canister: string;
  cane: string;
  caneDescription: string | null;
  disposeAllConsent: string | null;
  disposeAneuploidConsent: string | null;
  abandonedTissue: string | null;
  keepAneuploid: string | null;
  allAneuploidEmbryoStatus: string | null;
  cycleNumber: string | null;
  tankId: string;
  vaultId: string;
  canisterId: string;
  pieId: string;
  slotId: string;
  number: string;
}
