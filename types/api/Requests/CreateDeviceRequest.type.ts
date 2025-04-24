export type CreateDevicesRequest = {
  devices: CreateDevice[];
};

type CreateDevice = {
  caneId: string;
  specimenType: string;
  numberDescription?: string | null;
  notes: string;
  color?: string | null;
  rfid?: string | null;
  freezeDate?: string | null;
  expectedSpecimenQty: number;
  quantity: number;
};
