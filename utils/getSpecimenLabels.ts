import { PatientSpecimenTypes } from '@/constants/patients';
import { SpecimenTypeList } from '@/constants/specimens';

export function getSpecimenLabels(specimenTypes: string | string[]): string {
  const selectedValues = Array.isArray(specimenTypes)
    ? specimenTypes
    : specimenTypes.split(',').map(item => item.trim());
  const labelsList = selectedValues.map(value => {
    const specimen = SpecimenTypeList.find(specimen => specimen.value === value);
    return specimen ? specimen.label : value;
  });

  return labelsList.join(', ');
}

export function getPatientSpecimenTypesLabels(specimenTypes: string | string[]): string {
  const selectedValues = Array.isArray(specimenTypes)
    ? specimenTypes
    : specimenTypes.split(',').map(item => item.trim());
  const labelsList = selectedValues.map(value => {
    const specimen = PatientSpecimenTypes.find(specimen => specimen.value === value);
    return specimen ? specimen.label : value;
  });

  return labelsList.join(', ');
}
