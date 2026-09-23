import Link from "next/link";

import { ArrowLeft } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuthContext } from "@/lib/auth/get-auth-context";
import { createClient } from "@/lib/supabase/server";
import { getDeskFeatureAccess } from "@/server/access/resolve-desk-feature-access";
import { type CommunityDetail, getCommunityDetail } from "@/server/communities/community-repository";

import { UnitsTable } from "../_components/units-table";

const RECENT_TICKETS_LIMIT = 5;
const TICKET_STATUS_LABELS: Record<string, string> = { abierto: "Abierto", en_proceso: "En proceso" };

function MessageState({ title, body }: { title: string; body: string }) {
  return (
    <section className="flex min-h-[40vh] items-center justify-center rounded-3xl border border-border/60 bg-muted/20 p-8 text-center">
      <div className="max-w-md space-y-2">
        <h1 className="font-semibold text-xl">{title}</h1>
        <p className="text-muted-foreground text-sm">{body}</p>
      </div>
    </section>
  );
}

function EmptyState({ children }: { children: string }) {
  return (
    <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground text-sm">{children}</div>
  );
}

type LoadResult = { kind: "ok"; community: CommunityDetail } | { kind: "not_found" } | { kind: "error" };

async function loadCommunity(communityId: string): Promise<LoadResult> {
  try {
    const access = await getDeskFeatureAccess("consorcios");
    if (access?.consorcioScope == null) return { kind: "error" };
    const supabase = await createClient();
    const context = await getAuthContext(supabase);
    if (!context.authenticated || context.userType !== "tenant" || !context.organizationId) return { kind: "error" };
    const community = await getCommunityDetail(supabase, context.organizationId, access.consorcioScope, communityId);
    return community ? { kind: "ok", community } : { kind: "not_found" };
  } catch {
    return { kind: "error" };
  }
}

function BackLink() {
  return (
    <Button asChild variant="ghost" size="sm" className="-ml-2">
      <Link href="/dashboard/consorcios">
        <ArrowLeft className="size-4" />
        Consorcios
      </Link>
    </Button>
  );
}

export default async function ConsorcioDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const access = await getDeskFeatureAccess("consorcios");
  if (access?.state !== "resolved") {
    return <MessageState title="Sin acceso" body="No se puede mostrar el módulo con el acceso actual." />;
  }

  const { id } = await params;
  const result = await loadCommunity(id);
  if (result.kind === "not_found") {
    return (
      <div className="space-y-4">
        <BackLink />
        <MessageState title="Consorcio no encontrado" body="No existe o no lo tenés asignado." />
      </div>
    );
  }
  if (result.kind === "error") {
    return (
      <div className="space-y-4">
        <BackLink />
        <MessageState title="No se pudo cargar el consorcio" body="Probá de nuevo en unos minutos." />
      </div>
    );
  }

  const { community } = result;

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <BackLink />
        <h1 className="font-semibold text-3xl tracking-tight">{community.name}</h1>
        <p className="text-muted-foreground">
          {community.units.length} {community.units.length === 1 ? "unidad" : "unidades"} ·{" "}
          {community.activeTickets.length} {community.activeTickets.length === 1 ? "ticket activo" : "tickets activos"}
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Unidades</CardTitle>
        </CardHeader>
        <CardContent>
          {community.units.length === 0 ? (
            <EmptyState>Este consorcio no tiene unidades cargadas.</EmptyState>
          ) : (
            <UnitsTable units={community.units} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle className="text-lg">Tickets activos</CardTitle>
          {community.activeTickets.length > 0 && (
            <Button asChild variant="outline" size="sm">
              <Link href={`/dashboard/tickets?consorcio=${community.id}`}>Ver todos los tickets</Link>
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {community.activeTickets.length === 0 ? (
            <EmptyState>No hay tickets activos.</EmptyState>
          ) : (
            <div className="space-y-2">
              {community.activeTickets.slice(0, RECENT_TICKETS_LIMIT).map((ticket) => (
                <div
                  key={ticket.id}
                  className="grid gap-1 rounded-lg border p-4 md:grid-cols-[140px_minmax(0,1fr)_auto] md:items-center md:gap-4"
                >
                  <p className="font-semibold">{ticket.code}</p>
                  <p className="truncate text-muted-foreground text-sm">{ticket.description ?? "Sin descripción"}</p>
                  <div className="flex items-center gap-3 md:justify-end">
                    <span className="text-muted-foreground text-xs">
                      {new Date(ticket.createdAt).toLocaleDateString("es-AR")}
                    </span>
                    <Badge variant="outline">{TICKET_STATUS_LABELS[ticket.status] ?? ticket.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
