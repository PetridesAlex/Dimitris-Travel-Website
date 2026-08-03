import {
  ROLE_PERMISSIONS,
  type Permission,
  type UserRole,
} from '@luxury-travel/shared';

export function can(role: UserRole | undefined | null, permission: Permission) {
  if (!role) return false;
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function assertPermission(
  role: UserRole | undefined | null,
  permission: Permission,
) {
  if (!can(role, permission)) {
    throw new Error(`Forbidden: missing permission ${permission}`);
  }
}
