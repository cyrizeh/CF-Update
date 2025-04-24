import { DonorData, SpecimanDetailsByCane } from '@/types/view/Specimen.interface';

export function getExistedDonor(device: SpecimanDetailsByCane | null | undefined): DonorData | null {
  if (!device) {
    return null;
  }
  const donors: DonorData[] = [device.embryoDonor, device.oocyteDonor, device.spermDonor];
  for (const donor of donors) {
    if (donor !== null) {
      return donor;
    }
  }
  return null;
}
