import { Ticket, TicketBoard } from '../types/ticketing';

// Helper to calculate SLA due time
const getSlaDueAt = (priority: string, createdAt: string): string => {
  const created = new Date(createdAt);
  const hours = priority === 'High' ? 4 : priority === 'Medium' ? 8 : 24;
  created.setHours(created.getHours() + hours);
  return created.toISOString();
};

export const sampleTickets: Ticket[] = [
  // PENDING
  {
    id: 'TRX-09322',
    customer: 'Juan Dela Cruz',
    category: 'Installation',
    priority: 'High',
    assignee: 'RD',
    status: 'Pending',
    createdAt: '2025-10-20T14:15:00Z',
    slaDueAt: '2025-10-20T18:15:00Z',
    address: '456 BGC, Taguig City',
    phone: '+63 917 234 5678',
    email: 'juan.delacruz@mail.com',
    description: 'New fiber installation required for business customer.',
    notes: [],
    history: [
      { at: '2025-10-20T14:15:00Z', by: 'System', action: 'Created' }
    ]
  },
  {
    id: 'TRX-09323',
    customer: 'Rosa Martinez',
    category: 'Transfer',
    priority: 'Low',
    assignee: 'None',
    status: 'Pending',
    createdAt: '2025-10-18T11:00:00Z',
    slaDueAt: '2025-10-19T11:00:00Z',
    address: '789 Ortigas, Pasig City',
    phone: '+63 917 345 6789',
    email: 'rosa.martinez@mail.com',
    description: 'Customer relocating to new address. Service transfer needed.',
    notes: [],
    history: [
      { at: '2025-10-18T11:00:00Z', by: 'System', action: 'Created' }
    ]
  },
  {
    id: 'TRX-09324',
    customer: 'Carlos Ramos',
    category: 'IT Support',
    priority: 'High',
    assignee: 'TM',
    status: 'Pending',
    createdAt: '2025-10-17T08:45:00Z',
    slaDueAt: '2025-10-17T12:45:00Z',
    address: '321 QC Circle, Quezon City',
    phone: '+63 917 456 7890',
    email: 'carlos.ramos@mail.com',
    description: 'Router configuration issues. Customer unable to connect devices.',
    notes: [
      { at: '2025-10-17T09:00:00Z', by: 'Support', text: 'Customer called again, urgent request' }
    ],
    history: [
      { at: '2025-10-17T08:45:00Z', by: 'System', action: 'Created' }
    ]
  },
  {
    id: 'TRX-09325',
    customer: 'Maria Santos',
    category: 'Repair',
    priority: 'High',
    assignee: 'JL',
    status: 'Pending',
    createdAt: '2025-10-19T09:30:00Z',
    slaDueAt: '2025-10-19T13:30:00Z',
    address: '123 Makati Ave, Makati City',
    phone: '+63 917 123 4567',
    email: 'maria.santos@mail.com',
    description: 'Fiber optic cable damaged near customer premises.',
    notes: [],
    history: [
      { at: '2025-10-19T09:30:00Z', by: 'System', action: 'Created' }
    ]
  },
  
  // ONGOING
  {
    id: 'TRX-09313',
    customer: 'Tony Reyes',
    category: 'Repair',
    priority: 'Medium',
    assignee: 'JL',
    status: 'Ongoing',
    createdAt: '2025-10-17T15:15:00Z',
    slaDueAt: '2025-10-17T23:15:00Z',
    address: '333 Las Pinas, Las Pinas City',
    phone: '+63 917 890 1234',
    email: 'tony.reyes@mail.com',
    description: 'Connection drop issues during peak hours.',
    notes: [
      { at: '2025-10-17T16:00:00Z', by: 'JL', text: 'On site, checking signal levels' }
    ],
    history: [
      { at: '2025-10-17T15:15:00Z', by: 'System', action: 'Created' },
      { at: '2025-10-17T15:30:00Z', by: 'JL', action: 'Accept' },
      { at: '2025-10-17T16:00:00Z', by: 'JL', action: 'Onsite', meta: { geo: '14.5547° N, 120.9932° E' } }
    ]
  },
  {
    id: 'TRX-09314',
    customer: 'Ana Lopez',
    category: 'Transfer',
    priority: 'Low',
    assignee: 'RD',
    status: 'Ongoing',
    createdAt: '2025-10-18T13:00:00Z',
    slaDueAt: '2025-10-19T13:00:00Z',
    address: '444 Muntinlupa, Muntinlupa City',
    phone: '+63 917 901 2345',
    email: 'ana.lopez@mail.com',
    description: 'Service relocation to new office.',
    notes: [],
    history: [
      { at: '2025-10-18T13:00:00Z', by: 'System', action: 'Created' },
      { at: '2025-10-18T14:00:00Z', by: 'RD', action: 'Accept' }
    ]
  },
  {
    id: 'TRX-09315',
    customer: 'Pedro Cruz',
    category: 'IT Support',
    priority: 'High',
    assignee: 'TM',
    status: 'Ongoing',
    createdAt: '2025-10-19T11:45:00Z',
    slaDueAt: '2025-10-19T15:45:00Z',
    address: '555 Caloocan, Caloocan City',
    phone: '+63 917 012 3456',
    email: 'pedro.cruz@mail.com',
    description: 'VPN connection not working.',
    notes: [
      { at: '2025-10-19T12:00:00Z', by: 'TM', text: 'Troubleshooting remotely' }
    ],
    history: [
      { at: '2025-10-19T11:45:00Z', by: 'System', action: 'Created' },
      { at: '2025-10-19T11:50:00Z', by: 'TM', action: 'Accept' }
    ]
  },
  {
    id: 'TRX-09316',
    customer: 'Sofia Diaz',
    category: 'Repair',
    priority: 'Medium',
    assignee: 'JL',
    status: 'Ongoing',
    createdAt: '2025-10-18T09:20:00Z',
    slaDueAt: '2025-10-18T17:20:00Z',
    address: '666 Malabon, Malabon City',
    phone: '+63 917 123 4567',
    email: 'sofia.diaz@mail.com',
    description: 'Slow connection speeds reported.',
    notes: [],
    history: [
      { at: '2025-10-18T09:20:00Z', by: 'System', action: 'Created' },
      { at: '2025-10-18T10:00:00Z', by: 'JL', action: 'Accept' }
    ]
  },
  {
    id: 'TRX-09317',
    customer: 'Linda Santos',
    category: 'Repair',
    priority: 'High',
    assignee: 'JL',
    status: 'Ongoing',
    createdAt: '2025-10-19T16:20:00Z',
    slaDueAt: '2025-10-19T20:20:00Z',
    address: '654 Ermita, Manila',
    phone: '+63 917 567 8901',
    email: 'linda.santos@mail.com',
    description: 'Internet connection intermittent. Signal dropping frequently.',
    notes: [],
    history: [
      { at: '2025-10-19T16:20:00Z', by: 'System', action: 'Created' },
      { at: '2025-10-19T16:30:00Z', by: 'JL', action: 'Accept' }
    ]
  },
  {
    id: 'TRX-09318',
    customer: 'Miguel Fernandez',
    category: 'Installation',
    priority: 'Medium',
    assignee: 'RD',
    status: 'Ongoing',
    createdAt: '2025-10-18T10:00:00Z',
    slaDueAt: '2025-10-18T18:00:00Z',
    address: '111 Pasay, Pasay City',
    phone: '+63 917 678 9012',
    email: 'miguel.fernandez@mail.com',
    description: 'New installation for residential customer.',
    notes: [],
    history: [
      { at: '2025-10-18T10:00:00Z', by: 'System', action: 'Created' },
      { at: '2025-10-18T10:15:00Z', by: 'RD', action: 'Accept' }
    ]
  },
  {
    id: 'TRX-09319',
    customer: 'Elena Garcia',
    category: 'IT Support',
    priority: 'Low',
    assignee: 'TM',
    status: 'Ongoing',
    createdAt: '2025-10-19T14:30:00Z',
    slaDueAt: '2025-10-20T14:30:00Z',
    address: '222 Paranaque, Paranaque City',
    phone: '+63 917 789 0123',
    email: 'elena.garcia@mail.com',
    description: 'Email configuration support needed.',
    notes: [],
    history: [
      { at: '2025-10-19T14:30:00Z', by: 'System', action: 'Created' },
      { at: '2025-10-19T14:45:00Z', by: 'TM', action: 'Accept' }
    ]
  },
  
  // ESCALATED
  {
    id: 'TRX-09301',
    customer: 'David Tan',
    category: 'Repair',
    priority: 'High',
    assignee: 'JL',
    status: 'Escalated',
    createdAt: '2025-10-15T07:30:00Z',
    slaDueAt: '2025-10-15T11:30:00Z',
    address: '777 Navotas, Navotas City',
    phone: '+63 917 234 5678',
    email: 'david.tan@mail.com',
    description: 'Complete service outage for 24+ hours.',
    notes: [
      { at: '2025-10-15T08:00:00Z', by: 'JL', text: 'Multiple attempts to repair, need manager review' }
    ],
    history: [
      { at: '2025-10-15T07:30:00Z', by: 'System', action: 'Created' },
      { at: '2025-10-15T07:45:00Z', by: 'JL', action: 'Accept' },
      { at: '2025-10-15T08:00:00Z', by: 'JL', action: 'Escalate', meta: { reason: 'Requires infrastructure team' } }
    ]
  },
  {
    id: 'TRX-09302',
    customer: 'Grace Kim',
    category: 'Installation',
    priority: 'High',
    assignee: 'RD',
    status: 'Escalated',
    createdAt: '2025-10-16T10:15:00Z',
    slaDueAt: '2025-10-16T14:15:00Z',
    address: '888 Valenzuela, Valenzuela City',
    phone: '+63 917 345 6789',
    email: 'grace.kim@mail.com',
    description: 'Critical business installation delayed.',
    notes: [
      { at: '2025-10-16T11:00:00Z', by: 'RD', text: 'Waiting for fiber cable delivery' }
    ],
    history: [
      { at: '2025-10-16T10:15:00Z', by: 'System', action: 'Created' },
      { at: '2025-10-16T10:30:00Z', by: 'RD', action: 'Accept' },
      { at: '2025-10-16T11:00:00Z', by: 'RD', action: 'Escalate', meta: { reason: 'Logistics delay' } }
    ]
  },
  
  // COMPLETED
  {
    id: 'TRX-09290',
    customer: 'Robert Lee',
    category: 'Repair',
    priority: 'Medium',
    assignee: 'JL',
    status: 'Completed',
    createdAt: '2025-10-14T08:00:00Z',
    slaDueAt: '2025-10-14T16:00:00Z',
    address: '999 Marikina, Marikina City',
    phone: '+63 917 456 7890',
    email: 'robert.lee@mail.com',
    description: 'Cable replacement completed successfully.',
    notes: [
      { at: '2025-10-14T14:00:00Z', by: 'JL', text: 'Cable replaced, tested OK' }
    ],
    history: [
      { at: '2025-10-14T08:00:00Z', by: 'System', action: 'Created' },
      { at: '2025-10-14T09:00:00Z', by: 'JL', action: 'Accept' },
      { at: '2025-10-14T13:00:00Z', by: 'JL', action: 'Onsite', meta: { geo: '14.6507° N, 121.1029° E' } },
      { at: '2025-10-14T15:30:00Z', by: 'JL', action: 'Resolve', meta: { summary: 'Replaced damaged cable section' } }
    ]
  },
  {
    id: 'TRX-09291',
    customer: 'Lisa Wong',
    category: 'IT Support',
    priority: 'Low',
    assignee: 'TM',
    status: 'Completed',
    createdAt: '2025-10-15T13:30:00Z',
    slaDueAt: '2025-10-16T13:30:00Z',
    address: '101 San Juan, San Juan City',
    phone: '+63 917 567 8901',
    email: 'lisa.wong@mail.com',
    description: 'Router setup assistance completed.',
    notes: [],
    history: [
      { at: '2025-10-15T13:30:00Z', by: 'System', action: 'Created' },
      { at: '2025-10-15T14:00:00Z', by: 'TM', action: 'Accept' },
      { at: '2025-10-15T15:00:00Z', by: 'TM', action: 'Resolve', meta: { summary: 'Router configured via phone support' } }
    ]
  },
  {
    id: 'TRX-09292',
    customer: 'Mark Chen',
    category: 'Transfer',
    priority: 'Medium',
    assignee: 'RD',
    status: 'Completed',
    createdAt: '2025-10-13T15:45:00Z',
    slaDueAt: '2025-10-13T23:45:00Z',
    address: '102 Mandaluyong, Mandaluyong City',
    phone: '+63 917 678 9012',
    email: 'mark.chen@mail.com',
    description: 'Service transfer completed without issues.',
    notes: [],
    history: [
      { at: '2025-10-13T15:45:00Z', by: 'System', action: 'Created' },
      { at: '2025-10-13T16:00:00Z', by: 'RD', action: 'Accept' },
      { at: '2025-10-14T09:00:00Z', by: 'RD', action: 'Onsite', meta: { geo: '14.5794° N, 121.0359° E' } },
      { at: '2025-10-14T11:00:00Z', by: 'RD', action: 'Resolve', meta: { summary: 'Service transferred and tested' } }
    ]
  }
];

// Build board from tickets
export const buildInitialBoard = (): TicketBoard => {
  const board: TicketBoard = {
    pending: [],
    ongoing: [],
    escalated: [],
    completed: []
  };
  
  sampleTickets.forEach(ticket => {
    const status = ticket.status.toLowerCase() as keyof TicketBoard;
    board[status].push(ticket.id);
  });
  
  return board;
};

// Build ticket map
export const buildTicketMap = (): Map<string, Ticket> => {
  return new Map(sampleTickets.map(t => [t.id, t]));
};
