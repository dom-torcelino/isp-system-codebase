// Why: Centralized Single Source of Truth for backend API authorization.
export const RBAC_MATRIX = {
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