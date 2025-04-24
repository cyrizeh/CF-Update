import { locationStatuses } from '@/constants/specimens';

export function getLocationStatusLabels(locationStatusValues: string | string[]): string {
  const selectedValues = Array.isArray(locationStatusValues)
    ? locationStatusValues
    : locationStatusValues.split(',').map(item => item.trim());

  const labelsList = selectedValues.map(value => {
    const status = locationStatuses.find(location => location.value === value);
    return status ? status.label : value;
  });

  return labelsList.join(', ');
}
