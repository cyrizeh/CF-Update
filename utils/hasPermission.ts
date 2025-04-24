export const hasPermission = (permissions: string[], permission: string): boolean => {
  if (!permissions || !Array.isArray(permissions)) {
    console.error('Permissions should be a valid array');
    return false;
  }
  return permissions.includes(permission);
};
