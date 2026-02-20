import { z } from "zod";

  export const ticketSchema = z.object({
    id: z.string(), // TCK-1001
    title: z.string(), // Problema resumido
    createdAt: z.string(), // ISO date
    status: z.enum(["PENDIENTE", "EN_CURSO", "FINALIZADO"]),
    consorcio: z.string(),
    proveedor: z.string(),
    tag: z.string(),
    priority: z.number().int().min(1).max(3), // 1 = alta
  });
  export type Ticket = z.infer<typeof ticketSchema>;
