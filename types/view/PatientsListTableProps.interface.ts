import { Patient } from './Patient.interface';

export interface PatientsListTableProps {
  patients: Patient[];
  checkedIds?: string[] | null;
  onCheck?: (id: string) => void;
  onCheckAll?: () => void;
  isClinicAdmin?: boolean;
  userRole?: string;
  isLoading?: boolean;
}
