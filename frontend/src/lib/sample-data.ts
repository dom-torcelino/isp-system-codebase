import { Ticket, Tenant, Invoice, Customer, TicketStatus, InvoiceStatus } from '../types';

export const sampleTenants: Tenant[] = [
  { id: 'T001', name: 'FiberFast ISP', plan: 'Enterprise', status: 'Active', admin: 'John Santos', created: '2024-01-15', mrr: 125000 },
  { id: 'T002', name: 'SkyLine Net', plan: 'Pro', status: 'Active', admin: 'Maria Cruz', created: '2024-03-22', mrr: 85000 },
  { id: 'T003', name: 'BayLink Broadband', plan: 'Starter', status: 'Active', admin: 'Pedro Reyes', created: '2024-06-10', mrr: 45000 },
  { id: 'T004', name: 'MetroFiber', plan: 'Enterprise', status: 'Active', admin: 'Ana Dela Cruz', created: '2023-11-05', mrr: 155000 },
  { id: 'T005', name: 'CloudConnect ISP', plan: 'Trial', status: 'Trial', admin: 'Luis Garcia', created: '2025-10-01', mrr: 0 },
];

export const sampleTickets: Ticket[] = [
  { id: 'TRX-09321', customer: 'Maria Santos', category: 'Repair', priority: 'High', status: 'Pending', age: '1d 4h', slaEta: '3h 12m', assignee: 'JL' },
  { id: 'TRX-09318', customer: 'Jose Cruz', category: 'Installation', priority: 'Medium', status: 'Ongoing', age: '6h 22m', slaEta: '5h 48m', assignee: 'RD' },
  { id: 'TRX-09315', customer: 'Ana Reyes', category: 'Transfer', priority: 'Low', status: 'Pending', age: '2d 8h', slaEta: '1h 30m', assignee: '-' },
  { id: 'TRX-09310', customer: 'Pedro Aquino', category: 'IT Support', priority: 'High', status: 'Escalated', age: '3d 2h', slaEta: 'Overdue', assignee: 'TM' },
  { id: 'TRX-09305', customer: 'Carmen Lopez', category: 'Repair', priority: 'Medium', status: 'Ongoing', age: '12h 15m', slaEta: '4h 05m', assignee: 'JL' },
];

export const sampleInvoices: Invoice[] = [
  { id: 'INV-2025-0421', customer: 'Maria Santos', amount: 1500, status: 'Paid', dueDate: '2025-10-05', balance: 0 },
  { id: 'INV-2025-0422', customer: 'Jose Cruz', amount: 2200, status: 'Overdue', dueDate: '2025-09-28', balance: 2200 },
  { id: 'INV-2025-0423', customer: 'Ana Reyes', amount: 1800, status: 'Partial', dueDate: '2025-10-10', balance: 900 },
  { id: 'INV-2025-0424', customer: 'Pedro Aquino', amount: 3500, status: 'InDispute', dueDate: '2025-10-01', balance: 3500 },
  { id: 'INV-2025-0425', customer: 'Carmen Lopez', amount: 1200, status: 'Paid', dueDate: '2025-10-12', balance: 0 },
];

export const sampleCustomers: Customer[] = [
  { id: 'C001', name: 'Maria Santos', email: 'maria.s***@mail.com', city: 'Manila', plan: 'Pro', tags: ['VIP'], tenure: '2y 4m', balance: 0 },
  { id: 'C002', name: 'Jose Cruz', email: 'jose.c***@mail.com', city: 'Quezon City', plan: 'Starter', tags: ['ChurnRisk'], tenure: '8m', balance: 2200 },
  { id: 'C003', name: 'Ana Reyes', email: 'ana.r***@mail.com', city: 'Makati', plan: 'Enterprise', tags: ['VIP'], tenure: '3y 1m', balance: 900 },
  { id: 'C004', name: 'Pedro Aquino', email: 'pedro.a***@mail.com', city: 'Pasig', plan: 'Pro', tags: [], tenure: '1y 6m', balance: 3500 },
  { id: 'C005', name: 'Carmen Lopez', email: 'carmen.l***@mail.com', city: 'Cebu', plan: 'Starter', tags: ['New'], tenure: '2m', balance: 0 },
];

export const ticketsByStatus = [
  { name: 'Mon', Pending: 45, Ongoing: 38, Escalated: 8, Completed: 92 },
  { name: 'Tue', Pending: 52, Ongoing: 42, Escalated: 12, Completed: 88 },
  { name: 'Wed', Pending: 48, Ongoing: 45, Escalated: 10, Completed: 95 },
  { name: 'Thu', Pending: 58, Ongoing: 40, Escalated: 15, Completed: 102 },
  { name: 'Fri', Pending: 62, Ongoing: 48, Escalated: 11, Completed: 98 },
  { name: 'Sat', Pending: 38, Ongoing: 28, Escalated: 6, Completed: 65 },
  { name: 'Sun', Pending: 35, Ongoing: 25, Escalated: 5, Completed: 58 },
];

// Sparkline data for KPI cards
export const sparklineData = {
  tenants: [110, 115, 112, 118, 122, 125, 128],
  customers: [40200, 40800, 41200, 41500, 41800, 42100, 42310],
  tickets: [485, 470, 455, 438, 425, 418, 412],
  slaRisk: [52, 48, 45, 42, 40, 38, 37],
  mrr: [19800, 20200, 20600, 21000, 21400, 21600, 21800],
  overdue: [1050, 1080, 1120, 1095, 1110, 1130, 1142],
};

// Current ticket breakdown for stacked bar
export const currentTicketBreakdown = {
  Pending: 250,
  Ongoing: 120,
  Escalated: 42,
};

export const billingDistribution = [
  { name: 'Paid', value: 15420, fill: 'hsl(var(--chart-1))' },
  { name: 'Partial', value: 2180, fill: 'hsl(var(--chart-2))' },
  { name: 'Overdue', value: 1142, fill: 'hsl(var(--chart-4))' },
  { name: 'In Dispute', value: 83, fill: 'hsl(var(--chart-5))' },
];

export const churnRiskData = [
  { segment: 'Low', count: 15200 },
  { segment: 'Medium', count: 4800 },
  { segment: 'High', count: 1320 },
];

export const mrrTrend = [
  { month: 'May', MRR: 19200, ARPU: 485 },
  { month: 'Jun', MRR: 19800, ARPU: 492 },
  { month: 'Jul', MRR: 20400, ARPU: 498 },
  { month: 'Aug', MRR: 20800, ARPU: 505 },
  { month: 'Sep', MRR: 21200, ARPU: 512 },
  { month: 'Oct', MRR: 21800, ARPU: 517 },
];

export const auditEvents = [
  { time: '2h ago', event: 'Login lockout', user: 'john.d@fiberfast.com', detail: '5 failed attempts' },
  { time: '4h ago', event: 'Role change', user: 'admin@skyline.net', detail: 'Elevated to System Admin' },
  { time: '6h ago', event: 'Data export', user: 'maria.c@baylink.com', detail: 'Customer list CSV (1,284 records)' },
  { time: '8h ago', event: 'Bulk invoice deletion', user: 'billing@metrofiber.com', detail: '12 draft invoices removed' },
  { time: '1d ago', event: 'Payment gateway change', user: 'admin@fiberfast.com', detail: 'Switched to Stripe' },
];

export const integrationStatus = [
  { name: 'Mikrotik', status: 'Connected', health: 'OK', icon: 'Radio' },
  { name: 'Google Sheets', status: 'Two-way sync', health: 'OK', icon: 'Sheet' },
  { name: 'GCash', status: 'Connected', health: 'OK', icon: 'Wallet' },
  { name: 'PayMaya', status: 'Connected', health: 'OK', icon: 'Wallet' },
  { name: 'Stripe', status: 'Partial', health: 'Warning', icon: 'CreditCard' },
];

export const technicianJobs = [
  { time: '10:00 AM', area: 'Makati', tech: 'JL', customer: 'Ana Reyes' },
  { time: '11:30 AM', area: 'Manila', tech: 'RD', customer: 'Carlos Tan' },
  { time: '1:00 PM', area: 'Pasig', tech: 'TM', customer: 'Lisa Wong' },
  { time: '2:30 PM', area: 'QC', tech: 'JL', customer: 'Mark Diaz' },
  { time: '4:00 PM', area: 'Taguig', tech: 'RD', customer: 'Nina Cruz' },
];
