export const joinValues = (values: any[], separator: string): string => {
  return values.filter(Boolean).join(separator);
};
