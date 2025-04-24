export interface BillingNotification {
  id: string;
  type: string;
  method: string;
  status: string;
  sentAt: string;
  patientId: string;
}