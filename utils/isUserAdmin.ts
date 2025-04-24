import { UserRole } from "@/types";

export const isUserAdmin = (roles: UserRole []) => {
  return roles.includes(UserRole.SuperAdmin);
}