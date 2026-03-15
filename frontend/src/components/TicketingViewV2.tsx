import { useState, useMemo } from 'react';
import { UserRole } from '../types';
import { Ticket, TicketStatus, TicketBoard, ModalType, TicketNote, TicketHistory } from '../types/ticketing';
import { buildInitialBoard, buildTicketMap } from '../lib/ticket-data';
import { TicketWorkboard } from './TicketWorkboard';
import { TicketDetailsDrawerV2 } from './TicketDetailsDrawerV2';
import { AssignTicketModal } from './modals/AssignTicketModal';
import { EscalateTicketModal } from './modals/EscalateTicketModal';
import { ResolveTicketModal } from './modals/ResolveTicketModal';
import { toast } from 'sonner';

interface TicketingViewV2Props {
  userRole: UserRole;
}

export function TicketingViewV2({ userRole }: TicketingViewV2Props) {
  // SINGLE SOURCE OF TRUTH
  const [ticketMap, setTicketMap] = useState<Map<string, Ticket>>(buildTicketMap());
  const [board, setBoard] = useState<TicketBoard>(buildInitialBoard());
  
  // UI State
  const [modalOpen, setModalOpen] = useState<ModalType>('none');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  const selectedTicket = selectedTicketId ? ticketMap.get(selectedTicketId) || null : null;

  // === CORE ACTIONS (update ticketMap + board together) ===

  const handleMoveTicket = (ticketId: string, newStatus: TicketStatus) => {
    const ticket = ticketMap.get(ticketId);
    if (!ticket) return;

    const oldStatus = ticket.status;
    if (oldStatus === newStatus) return;

    // Update ticket in map
    const updatedTicket: Ticket = {
      ...ticket,
      status: newStatus,
      history: [
        ...ticket.history,
        {
          at: new Date().toISOString(),
          by: userRole,
          action: 'StatusChange',
          meta: { from: oldStatus, to: newStatus }
        }
      ]
    };

    setTicketMap(new Map(ticketMap.set(ticketId, updatedTicket)));

    // Update board
    setBoard(prev => {
      const oldKey = oldStatus.toLowerCase() as keyof TicketBoard;
      const newKey = newStatus.toLowerCase() as keyof TicketBoard;
      
      return {
        ...prev,
        [oldKey]: prev[oldKey].filter(id => id !== ticketId),
        [newKey]: [ticketId, ...prev[newKey]]
      };
    });

    toast.success(`Ticket ${ticketId} moved to ${newStatus}`);
  };

  const handleAssignTicket = (ticketId: string, assignee: string) => {
    const ticket = ticketMap.get(ticketId);
    if (!ticket) return;

    const updatedTicket: Ticket = {
      ...ticket,
      assignee,
      history: [
        ...ticket.history,
        {
          at: new Date().toISOString(),
          by: userRole,
          action: 'Reassign',
          meta: { from: ticket.assignee, to: assignee }
        }
      ]
    };

    setTicketMap(new Map(ticketMap.set(ticketId, updatedTicket)));
    toast.success(`Assigned to ${assignee}`);
  };

  const handleEscalateTicket = (ticketId: string, reason: string) => {
    const ticket = ticketMap.get(ticketId);
    if (!ticket) return;

    const updatedTicket: Ticket = {
      ...ticket,
      status: 'Escalated',
      history: [
        ...ticket.history,
        {
          at: new Date().toISOString(),
          by: userRole,
          action: 'Escalate',
          meta: { reason: reason || 'Manager review needed' }
        }
      ]
    };

    setTicketMap(new Map(ticketMap.set(ticketId, updatedTicket)));

    // Update board
    setBoard(prev => {
      const oldKey = ticket.status.toLowerCase() as keyof TicketBoard;
      
      return {
        ...prev,
        [oldKey]: prev[oldKey].filter(id => id !== ticketId),
        escalated: [ticketId, ...prev.escalated]
      };
    });

    toast.success('Ticket escalated');
  };

  const handleResolveTicket = (ticketId: string, summary: string) => {
    const ticket = ticketMap.get(ticketId);
    if (!ticket) return;

    const updatedTicket: Ticket = {
      ...ticket,
      status: 'Completed',
      history: [
        ...ticket.history,
        {
          at: new Date().toISOString(),
          by: userRole,
          action: 'Resolve',
          meta: { summary: summary || 'Issue resolved' }
        }
      ]
    };

    setTicketMap(new Map(ticketMap.set(ticketId, updatedTicket)));

    // Update board
    setBoard(prev => {
      const oldKey = ticket.status.toLowerCase() as keyof TicketBoard;
      
      return {
        ...prev,
        [oldKey]: prev[oldKey].filter(id => id !== ticketId),
        completed: [ticketId, ...prev.completed]
      };
    });

    toast.success('Marked resolved');
  };

  const handleAddNote = (ticketId: string, noteText: string) => {
    const ticket = ticketMap.get(ticketId);
    if (!ticket) return;

    const newNote: TicketNote = {
      at: new Date().toISOString(),
      by: userRole,
      text: noteText
    };

    const updatedTicket: Ticket = {
      ...ticket,
      notes: [...ticket.notes, newNote]
    };

    setTicketMap(new Map(ticketMap.set(ticketId, updatedTicket)));
    toast.success('Note added');
  };

  const handleOpenModal = (modal: ModalType, ticketId?: string) => {
    if (modal === 'details' && ticketId) {
      setSelectedTicketId(ticketId);
    }
    setModalOpen(modal);
  };

  const handleCloseDetailsDrawer = () => {
    setModalOpen('none');
    setSelectedTicketId(null);
  };

  return (
    <>
      <TicketWorkboard
        userRole={userRole}
        ticketMap={ticketMap}
        board={board}
        onOpenModal={handleOpenModal}
        onMoveTicket={handleMoveTicket}
      />

      {/* Details Drawer */}
      <TicketDetailsDrawerV2
        open={modalOpen === 'details'}
        onOpenChange={(open) => {
          if (!open) handleCloseDetailsDrawer();
        }}
        ticket={selectedTicket}
        userRole={userRole}
        onOpenModal={handleOpenModal}
        onAddNote={handleAddNote}
      />

      {/* Assign Modal */}
      {selectedTicket && (
        <AssignTicketModal
          open={modalOpen === 'assign'}
          onOpenChange={(open) => !open && setModalOpen('none')}
          currentAssignee={selectedTicket.assignee}
          onConfirm={(assignee) => handleAssignTicket(selectedTicket.id, assignee)}
        />
      )}

      {/* Escalate Modal */}
      {selectedTicket && (
        <EscalateTicketModal
          open={modalOpen === 'escalate'}
          onOpenChange={(open) => !open && setModalOpen('none')}
          ticketId={selectedTicket.id}
          onConfirm={(reason) => handleEscalateTicket(selectedTicket.id, reason)}
        />
      )}

      {/* Resolve Modal */}
      {selectedTicket && (
        <ResolveTicketModal
          open={modalOpen === 'resolve'}
          onOpenChange={(open) => !open && setModalOpen('none')}
          ticketId={selectedTicket.id}
          onConfirm={(summary) => handleResolveTicket(selectedTicket.id, summary)}
        />
      )}
    </>
  );
}
