import { UserRole } from "@/types";

export const isUserAccountAdmin = (roles: UserRole []) => {
  return roles?.includes(UserRole.AccountAdmin);
}