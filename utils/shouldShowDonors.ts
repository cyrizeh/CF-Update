export function shouldShowDonors(tissueType: string): boolean {
  const restrictedTypes: string[] = ['Sperm', 'Oocyte', 'Embryos'];
  return restrictedTypes.includes(tissueType);
}
