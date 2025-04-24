import { ListResponse } from './ListResponse.type';

export interface NotificationsResponse extends ListResponse {
  items: Array<Notification>;
}

interface Patient {
  id: string;
  referenceId: string;
  email: string;
  firstName: string;
  middleName: string;
  lastName: string;
  fullName: string;
  firstAndLast: string;
}

interface Notification {
  id: string;
  patient: Patient;
  clinicId: string;
  clinicName: string;
  type: string;
  note: string;
  entityType: string;
  entityId: string;
  isRead: boolean;
  created: Date;
  requestedBy: string;
  processedBy: string;
}
