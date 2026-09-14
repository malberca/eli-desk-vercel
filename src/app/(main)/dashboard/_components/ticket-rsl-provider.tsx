"use client";

import * as React from "react";

import { emitTicketRslEvent } from "@/lib/realtime/ticket-rsl-events";
import { createClient } from "@/lib/supabase/client";
import { listTicketEdificios } from "@/server/tickets/ticket-actions";

type TicketRslProviderProps = {
  organizationId: string | null;
  children: React.ReactNode;
};

export function TicketRslProvider({ organizationId, children }: TicketRslProviderProps) {
  React.useEffect(() => {
    if (!organizationId) return;

    const supabase = createClient();
    let cancelled = false;
    const channels: ReturnType<typeof supabase.channel>[] = [];

    async function subscribe() {
      const result = await listTicketEdificios();

      if (cancelled || !result.success) {
        if (!result.success) {
          console.error("[RSL] Could not resolve authorized consorcios");
        }
        return;
      }

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.access_token) {
        console.error("[RSL] No authenticated browser session", sessionError);
        return;
      }

      await supabase.realtime.setAuth(session.access_token);

      for (const edificio of result.data) {
        if (cancelled) break;

        const topic = `organization:${organizationId}:consorcio:${edificio.id}:tickets`;

        const channel = supabase
          .channel(topic, {
            config: { private: true },
          })
          .on("broadcast", { event: "ticket.created" }, (message) => {
            const ticketId = typeof message.payload?.ticketId === "string" ? message.payload.ticketId : null;

            if (!ticketId) {
              console.error("[RSL] Invalid ticket.created payload", message);
              return;
            }

            emitTicketRslEvent({
              type: "ticket.created",
              ticketId,
              edificioId: edificio.id,
            });

            console.info("[RSL] EVENT ticket.created", {
              edificioId: edificio.id,
              message,
            });
          })
          .on("broadcast", { event: "ticket.updated" }, (message) => {
            const ticketId = typeof message.payload?.ticketId === "string" ? message.payload.ticketId : null;

            if (!ticketId) {
              console.error("[RSL] Invalid ticket.updated payload", message);
              return;
            }

            emitTicketRslEvent({
              type: "ticket.updated",
              ticketId,
              edificioId: edificio.id,
            });

            console.info("[RSL] EVENT ticket.updated", {
              edificioId: edificio.id,
              message,
            });
          })
          .on("broadcast", { event: "ticket.closed" }, (message) => {
            const ticketId = typeof message.payload?.ticketId === "string" ? message.payload.ticketId : null;

            if (!ticketId) {
              console.error("[RSL] Invalid ticket.closed payload", message);
              return;
            }

            emitTicketRslEvent({
              type: "ticket.closed",
              ticketId,
              edificioId: edificio.id,
            });

            console.info("[RSL] EVENT ticket.closed", {
              edificioId: edificio.id,
              message,
            });
          });

        channels.push(channel);

        channel.subscribe((status, error) => {
          if (status === "SUBSCRIBED") {
            console.info("[RSL] SUBSCRIBED", {
              edificioId: edificio.id,
              edificioNombre: edificio.nombre,
            });
          }

          if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
            console.error("[RSL]", status, {
              edificioId: edificio.id,
              error,
            });
          }
        });
      }
    }

    void subscribe();

    return () => {
      cancelled = true;

      for (const channel of channels) {
        void supabase.removeChannel(channel);
      }
    };
  }, [organizationId]);

  return children;
}
