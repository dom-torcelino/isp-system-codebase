import { UserRole } from '../types';

export type ModuleName =
  | 'overview'
  | 'auth'
  | 'tenants'
  | 'tickets'
  | 'technicians'
  | 'crm'
  | 'billing'
  | 'revenue'
  | 'reports'
  | 'compliance'
  | 'integrations'
  | 'portal'
  | 'settings';

export type AccessLevel = 'full' | 'readonly' | 'none';

interface ModuleAccess {
  [key: string]: AccessLevel;
}

// RBAC Matrix: Define access levels for each role and module
const RBAC_MATRIX: Record<UserRole, ModuleAccess> = {
  SuperAdmin: {
    overview: 'full',
    auth: 'full',
    tenants: 'full',
    tickets: 'full',
    technicians: 'full',
    crm: 'full',
    billing: 'full',
    revenue: 'full',
    reports: 'full',
    compliance: 'full',
    integrations: 'full',
    portal: 'full',
    settings: 'full',
  },
  SystemAdmin: {
    overview: 'full',
    auth: 'full', // tenant scope only
    tenants: 'none',
    tickets: 'full',
    technicians: 'full',
    crm: 'full',
    billing: 'full',
    revenue: 'none',
    reports: 'full',
    compliance: 'full',
    integrations: 'full',
    portal: 'readonly',
    settings: 'full', // tenant scope
  },
  CustomerSupport: {
    overview: 'full',
    auth: 'none',
    tenants: 'none',
    tickets: 'full',
    technicians: 'readonly',
    crm: 'full',
    billing: 'full', // payments/disputes only
    revenue: 'none',
    reports: 'none',
    compliance: 'none',
    integrations: 'none',
    portal: 'none',
    settings: 'none',
  },
  Technician: {
    overview: 'full', // own stats only
    auth: 'none',
    tenants: 'none',
    tickets: 'full', // assigned only
    technicians: 'full',
    crm: 'none',
    billing: 'none',
    revenue: 'none',
    reports: 'none',
    compliance: 'none',
    integrations: 'none',
    portal: 'none',
    settings: 'none',
  },
};

export function hasAccess(role: UserRole, module: ModuleName): boolean {
  const access = RBAC_MATRIX[role][module];
  return access === 'full' || access === 'readonly';
}

export function getAccessLevel(role: UserRole, module: ModuleName): AccessLevel {
  return RBAC_MATRIX[role][module] || 'none';
}

export function canEdit(role: UserRole, module: ModuleName): boolean {
  return RBAC_MATRIX[role][module] === 'full';
}

export function getAccessDeniedReason(role: UserRole, module: ModuleName): string {
  const accessLevel = getAccessLevel(role, module);
  
  if (accessLevel === 'none') {
    switch (module) {
      case 'revenue':
        return 'Restricted to Super Admin only';
      case 'tenants':
        return 'Restricted to Super Admin only';
      case 'auth':
        return role === 'CustomerSupport' || role === 'Technician'
          ? 'Restricted to Admin roles'
          : 'Access denied';
      case 'reports':
        return 'Restricted to Admin roles';
      case 'compliance':
        return 'Restricted to Admin roles';
      case 'integrations':
        return 'Restricted to Admin roles';
      case 'settings':
        return 'Restricted to Admin roles';
      case 'crm':
        return 'Field technicians cannot access customer data';
      case 'billing':
        return 'Field technicians cannot access billing';
      default:
        return `Access denied by RBAC - ${role} role cannot access ${module}`;
    }
  }
  
  return '';
}

export function getModuleAccessList(role: UserRole): ModuleName[] {
  return Object.entries(RBAC_MATRIX[role])
    .filter(([_, access]) => access !== 'none')
    .map(([module]) => module as ModuleName);
}
