export type CreateTransfersToClinicRequest = {
  caneIds: string[];
  clinicName?: string;
  clinicId?: string;
  notes?: string;
  techInitials?: string;
  shipmentDate: string;
};
