export type UpdatedeviceRequest = {
  specimenType: string;
  numberDescription: string | null;
  notes: string;
  color?: string | null;
  freezeDate?: string | Date | null;
  expectedSpecimenQty: number;
  quantity: number;
  caneId: string;
  id: string;
};
