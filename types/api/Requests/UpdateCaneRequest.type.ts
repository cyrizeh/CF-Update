export type UpdateCaneRequest = {
  caneId: string;
  patientId?: string;
  clinicId?: string;
  rfid?: string | null;
  caneDescription: string;
  disposeAneuploidConsent?: boolean | null;
  abandonedTissue?: boolean | null;
  keepAneuploid?: boolean | null;
  aneuploidEmbryoStatus?: string | null;
  cycleNumber?: string | null;
  idLabResult?: string | null;
  specimenType?: string | null;
  expectedDeviceQty?: number | null;
  label?: string | null;
  notes?: string | null;
  primaryIdentifierId: string;
  receiptDate: string | null;
};
