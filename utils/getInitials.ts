export function getInitials(fullName: string): string {
  if (!fullName) return '';
  const nameParts = fullName.split(' '); 
  const initials = nameParts
    .map((part) => part.charAt(0).toUpperCase()) 
    .join('');
  return initials;
}