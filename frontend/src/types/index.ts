export type UserRole = 'SuperAdmin' | 'SystemAdmin' | 'Technician' | 'CustomerSupport';

export type TicketStatus = 'Pending' | 'Ongoing' | 'Escalated' | 'Completed';
export type TicketPriority = 'Low' | 'Medium' | 'High';
export type TicketCategory = 'Installation' | 'Repair' | 'Transfer' | 'IT Support';

export type InvoiceStatus = 'Paid' | 'Partial' | 'Overdue' | 'InDispute';
export type TenantStatus = 'Active' | 'Suspended' | 'Trial';
export type CustomerTag = 'VIP' | 'ChurnRisk' | 'New' | 'Delinquent';

export type DateRange = '7d' | '30d' | '90d' | 'Custom';

export interface Ticket {
  id: string;
  customer: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  age: string;
  slaEta: string;
  assignee: string;
}

export interface Tenant {
  id: string;
  name: string;
  plan: string;
  status: TenantStatus;
  admin: string;
  created: string;
  mrr: number;
}

export interface Invoice {
  id: string;
  customer: string;
  amount: number;
  status: InvoiceStatus;
  dueDate: string;
  balance: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  city: string;
  plan: string;
  tags: CustomerTag[];
  tenure: string;
  balance: number;
}
