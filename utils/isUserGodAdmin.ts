import { UserRole } from "@/types";

export const isUserGodAdmin = (roles: UserRole []) => {
  return roles.includes(UserRole.GodAdmin);
}