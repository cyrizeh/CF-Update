import { FDAEligibilityType } from './AddSpecimanModal.type';

export type EditCaneModalFormValues = {
  // 1st Step
  receiptDate: string | null;
  deviceNumber: number;
  caneColor: string;
  caneLabel: string;
  id: string;
  primaryIdentifier: { id: string; name: string; userId: string };
  // 2nd Step
  idLabResult: string;
  FDAEligibility: FDAEligibilityType | null;
  reactivity: boolean | null;
  reactive: any;
};
