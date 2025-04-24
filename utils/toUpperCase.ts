export const handleInputToUpperCase = (e: React.FormEvent<HTMLInputElement>) => {
  const input = e.currentTarget.value;
  // Replace any non-alphanumeric characters with an empty string and convert to uppercase
  e.currentTarget.value = input.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
};
