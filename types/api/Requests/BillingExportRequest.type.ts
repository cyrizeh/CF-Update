export type BillingExportRequest = {
  selectedIds: string[];
  patientId?: string;
  clinicId?: string;
  facilityId?: string;
  name?: string;
  status?: string;
  dueDate?: string;
  q?: string;
  sort?: string;
  paymentDateFrom?: string;
  paymentDateTo?: string;
};
