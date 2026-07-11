export const ROLE_OPTIONS_BY_ADMIN: Record<string, string[]> = {
  server_admin: ['employee', 'manager', 'it_admin', 'server_admin'],
  it_admin: ['employee', 'manager'],
};

export const ROLE_LABELS: Record<string, string> = {
  server_admin: 'Server Admin',
  it_admin: 'IT Admin',
  manager: 'Manager',
  employee: 'Employee',
};

export const ROLE_BADGE_STYLES: Record<string, string> = {
  server_admin: '#A3402F',
  it_admin: '#5B7A99',
  manager: '#3F7A5C',
  employee: '#6B655A',
};

/**
 * Can `creatorRole` create/assign an account with `targetRole`?
 * Used both client-side (to populate the role dropdown) and, more
 * importantly, server-side in the admin API route — the client check
 * is just UX, the server check is what actually enforces this.
 */
export function canAssignRole(creatorRole: string | null, targetRole: string) {
  if (!creatorRole) return false;
  return (ROLE_OPTIONS_BY_ADMIN[creatorRole] ?? []).includes(targetRole);
}