// Ticketing v2 - Clean rebuild types

export type TicketStatus = 'Pending' | 'Ongoing' | 'Escalated' | 'Completed';
export type TicketPriority = 'Low' | 'Medium' | 'High';
export type TicketCategory = 'Installation' | 'Repair' | 'Transfer' | 'IT Support';

export interface TicketNote {
  at: string; // ISO timestamp
  by: string; // User name
  text: string;
}

export interface TicketHistory {
  at: string; // ISO timestamp
  by: string; // User name
  action: 'Created' | 'Accept' | 'Onsite' | 'Escalate' | 'Resolve' | 'Close' | 'StatusChange' | 'Reassign';
  meta?: {
    from?: string;
    to?: string;
    summary?: string;
    geo?: string;
    reason?: string;
  };
}

export interface Ticket {
  id: string;
  customer: string;
  category: TicketCategory;
  priority: TicketPriority;
  assignee: string; // "JL" | "RD" | "TM" | "None"
  status: TicketStatus; // SINGLE SOURCE OF TRUTH
  createdAt: string; // ISO timestamp
  slaDueAt: string; // ISO timestamp
  address: string;
  phone: string;
  email: string;
  description?: string;
  notes: TicketNote[];
  history: TicketHistory[];
}

export interface TicketBoard {
  pending: string[];
  ongoing: string[];
  escalated: string[];
  completed: string[];
}

export interface TicketFilters {
  category: Set<TicketCategory>;
  priority: Set<TicketPriority>;
  assignee: Set<string>;
  dateRange: '7d' | '30d' | '90d' | 'Custom';
  status: Set<TicketStatus>;
  searchQuery: string;
}

export type ModalType = 'none' | 'create' | 'assign' | 'escalate' | 'resolve' | 'slaSettings' | 'details';
