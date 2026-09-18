import type { TicketRecord } from "./ticket-repository";

export type AuthoritativeTicketCloseInput = {
  id: string;
  closedReason: string;
};

export interface AuthoritativeTicketCloseDependencies {
  closeTicket(id: string, closedReason: string): Promise<TicketRecord>;
}

/**
 * The deployed DB trigger owns the authoritative MCV snapshot and outbox insert
 * in the same transaction as this ticket update. The APP deliberately has no
 * recipient, dispatcher, webhook, or retry dependency on the close path.
 */
export function executeAuthoritativeTicketClose(
  input: AuthoritativeTicketCloseInput,
  dependencies: AuthoritativeTicketCloseDependencies,
): Promise<TicketRecord> {
  return dependencies.closeTicket(input.id, input.closedReason);
}
