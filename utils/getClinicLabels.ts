import { clinicTypes } from '@/constants/clinics';

export function getClinicLabels(clinicTypeValues: string | string[]): string {
  const selectedValues = Array.isArray(clinicTypeValues)
    ? clinicTypeValues
    : clinicTypeValues.split(',').map(item => item.trim());

  const labelsList = selectedValues.map(value => {
    const clinicType = clinicTypes.find(clinic => clinic.value === value);
    return clinicType ? clinicType.label : value;
  });

  return labelsList.join(', ');
}
