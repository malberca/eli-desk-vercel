export type TicketRslEventType = "ticket.created" | "ticket.updated" | "ticket.closed";

export type TicketRslEvent = {
  type: TicketRslEventType;
  ticketId: string;
  edificioId: string;
};

type TicketRslListener = (event: TicketRslEvent) => void;

const listeners = new Set<TicketRslListener>();

export function emitTicketRslEvent(event: TicketRslEvent) {
  for (const listener of listeners) {
    listener(event);
  }
}

export function subscribeTicketRslEvent(listener: TicketRslListener) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}
