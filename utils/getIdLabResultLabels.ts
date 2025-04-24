import { IdLabResultList } from '@/constants/specimens';

export function getIdLabResultLabels(idLabResultTypes: string | string[]): string {
  const selectedValues = Array.isArray(idLabResultTypes)
    ? idLabResultTypes
    : idLabResultTypes.split(',').map(item => item.trim());
  const labelsList = selectedValues.map(value => {
    const specimen = IdLabResultList.find(idResultType => idResultType.value === value);
    return specimen ? specimen.label : value;
  });

  return labelsList.join(', ');
}
