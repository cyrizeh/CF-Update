import { UserRole } from "@/types";

export const isUserPatient = (roles: UserRole[]) => {
  return roles.includes(UserRole.Patient);
}