import { UserRole } from "@/types";

export const isUserClinicAdmin = (roles: UserRole []) => {
  return roles?.includes(UserRole.ClinicAdmin);
}