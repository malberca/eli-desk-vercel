import Link from "next/link";

import { ArrowLeft } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuthContext } from "@/lib/auth/get-auth-context";
import { createClient } from "@/lib/supabase/server";
import { getDeskFeatureAccess } from "@/server/access/resolve-desk-feature-access";
import { type CommunityDetail, getCommunityDetail } from "@/server/communities/community-repository";

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
            <div className="space-y-3">
              {community.units.map((unit) => (
                <div key={unit.id} className="space-y-3 rounded-lg border p-4">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <p className="font-semibold">Unidad {unit.number ?? "s/n"}</p>
                    {unit.floor && <span className="text-muted-foreground text-sm">Piso {unit.floor}</span>}
                    {unit.type && <span className="text-muted-foreground text-sm">{unit.type}</span>}
                    {unit.status && (
                      <Badge variant="outline" className="ml-auto">
                        {unit.status}
                      </Badge>
                    )}
                  </div>
                  {unit.residents.length === 0 ? (
                    <p className="text-muted-foreground text-sm">Sin residentes activos.</p>
                  ) : (
                    <ul className="space-y-2">
                      {unit.residents.map((resident) => (
                        <li
                          key={resident.id}
                          className="grid gap-1 text-sm md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-center"
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-medium">{resident.name}</span>
                            {resident.relationship && (
                              <span className="text-muted-foreground">{resident.relationship}</span>
                            )}
                            {resident.isPrimary && <Badge variant="secondary">Principal</Badge>}
                          </div>
                          <div className="flex flex-wrap gap-x-4 text-muted-foreground md:justify-end">
                            {resident.phone && <span>{resident.phone}</span>}
                            {resident.email && <span className="break-all">{resident.email}</span>}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tickets activos</CardTitle>
        </CardHeader>
        <CardContent>
          {community.activeTickets.length === 0 ? (
            <EmptyState>No hay tickets activos.</EmptyState>
          ) : (
            <div className="space-y-2">
              {community.activeTickets.map((ticket) => (
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
