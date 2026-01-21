// src/lib/rbac.ts
import { Role } from "@prisma/client";

/**
 * Decide role based on email
 */
export function getRoleFromEmail(email: string): Role {
  if (email.endsWith("@doc.com")) {
    return Role.DOCTOR;
  }
  return Role.PATIENT;
}

/**
 * RBAC check
 */
export function allowRole(userRole: Role, allowedRoles: Role[]): boolean {
  return allowedRoles.includes(userRole);
}
