export type CreateCaneRequest = {
  patientId: string;
  clinicId: string;
  rfid?: string | null;
  caneDescription: string;
  label?: string | null;
  notes?: string | null;
  disposeAneuploidConsent?: boolean | null;
  abandonedTissue?: boolean | null;
  keepAneuploid?: boolean | null;
  aneuploidEmbryoStatus?: string | null;
  cycleNumber?: string | null;
  expectedDeviceQty?: number | null;
  primaryIdentifierId: string;
  receiptDate: string | null;
  facilityId: string;
};
