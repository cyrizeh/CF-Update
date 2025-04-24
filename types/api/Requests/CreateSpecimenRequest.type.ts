export type CreateSpecimenRequest = {
  deviceId: string;
  embryoOocyteNumber?: string | null;
  gradeMaturity?: string | null;
  pgtResults?: string | null;
  dateOfThaw?: Date | null;
  usedFor?: string | null;
};
