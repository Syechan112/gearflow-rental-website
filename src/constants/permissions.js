export const DEFAULT_STAFF_PERMISSIONS = {
  can_checkout: true,
  can_approve_booking: true,
  can_view_reports: false,
};

export function getStaffPermissions(user) {
  if (!user) return DEFAULT_STAFF_PERMISSIONS;
  if (user.role === 'owner') {
    return {
      can_checkout: true,
      can_approve_booking: true,
      can_view_reports: true,
    };
  }
  return {
    ...DEFAULT_STAFF_PERMISSIONS,
    ...(user.permissions || {}),
  };
}

export function hasPermission(user, permKey) {
  if (!user) return false;
  if (user.role === 'owner') return true;
  const perms = getStaffPermissions(user);
  return Boolean(perms[permKey]);
}
