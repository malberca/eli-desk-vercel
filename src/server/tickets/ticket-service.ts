import {
  type CreateTicketInput,
  TICKET_PRIORITIES,
  TICKET_TYPES,
  type TicketPriority,
  type TicketType,
  type UpdateTicketInput,
} from "./ticket-repository";

function requiredText(value: unknown, field: string) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} es obligatorio.`);
  return value.trim();
}

function enumValue<T extends readonly string[]>(value: unknown, allowed: T, field: string): T[number] {
  if (typeof value !== "string" || !allowed.includes(value)) throw new Error(`${field} no es válido.`);
  return value as T[number];
}

export function validateTicketInput(input: Record<string, unknown>): CreateTicketInput {
  return {
    edificio_id: requiredText(input.edificio_id, "El consorcio"),
    ticket_type: enumValue(input.ticket_type, TICKET_TYPES, "El tipo") as TicketType,
    priority: enumValue(input.priority, TICKET_PRIORITIES, "La prioridad") as TicketPriority,
    category: typeof input.category === "string" && input.category.trim() ? input.category.trim() : null,
    description: requiredText(input.description, "La descripción"),
  };
}

export function validateStatus(value: unknown): "abierto" | "en_proceso" {
  if (value !== "abierto" && value !== "en_proceso") throw new Error("El estado no es válido para esta acción.");
  return value;
}

export function validateCloseReason(value: unknown) {
  return requiredText(value, "El motivo de cierre");
}

export function toUpdateInput(input: Record<string, unknown>): UpdateTicketInput {
  return validateTicketInput(input);
}
