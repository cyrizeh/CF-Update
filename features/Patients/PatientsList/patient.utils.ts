import { PatientStatus } from '@/types/Patients.enum';

export const patientStatus = (data: PatientStatus): string => {
  if (data === PatientStatus.Created) return 'Completed';
  if (data === PatientStatus.Draft) return 'Incomplete';
  return '';
};
