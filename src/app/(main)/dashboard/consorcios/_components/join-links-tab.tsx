"use client";

import * as React from "react";

import { useRouter } from "next/navigation";

import { ListCell, ListEmpty, ListHead, ListTable, Pill } from "@/app/(main)/dashboard/_components/list-table";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { TableBody, TableHeader, TableRow } from "@/components/ui/table";
import { revokeJoinLinkAction } from "@/server/join-links/join-link-actions";
import type { JoinLinkSummary } from "@/server/join-links/join-link-repository";

import { CreateJoinLinkDialog } from "./create-join-link-dialog";
import { JoinLinkQr } from "./join-link-qr";

const dateFormat = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export type JoinLinksTabData = { links: JoinLinkSummary[] | null; canManage: boolean };

export function JoinLinksTab({
  communityId,
  communityName,
  address,
  data,
}: {
  communityId: string;
  communityName: string;
  address: string;
  data: JoinLinksTabData;
}) {
  const router = useRouter();
  const [revoking, setRevoking] = React.useState<JoinLinkSummary | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  if (data.links === null) return <ListEmpty>No se pudieron cargar los links de acceso.</ListEmpty>;

  // Links come newest first, so this is the most recent active one.
  const current = data.links.find((link) => link.status === "active");

  async function confirmRevoke(link: JoinLinkSummary) {
    setBusy(true);
    setError(null);
    const result = await revokeJoinLinkAction(link.id);
    setBusy(false);
    if (!result.success) {
      setError(result.error);
      return;
    }
    setRevoking(null);
    router.refresh();
  }

  const createButton = data.canManage && (
    <CreateJoinLinkDialog communityId={communityId} communityName={communityName} address={address} />
  );

  return (
    <div className="space-y-6">
      {!current ? (
        <div className="space-y-4 rounded-xl border border-dashed bg-card p-8 text-center">
          <p className="text-muted-foreground text-sm">
            Este consorcio no tiene un link de acceso activo. Los vecinos se dan de alta con el link o el QR, y las
            solicitudes llegan a Signup.
          </p>
          {createButton}
        </div>
      ) : current.url ? (
        <section className="space-y-3">
          <p className="text-muted-foreground text-sm">
            Con este link o QR los vecinos de {communityName} se dan de alta en ELI. Activo desde el{" "}
            {dateFormat.format(new Date(current.createdAt))}
          </p>
          {data.canManage ? (
            <JoinLinkQr
              url={current.url}
              communityName={communityName}
              revokeLabel="Revocar"
              busy={busy}
              error={null}
              onRevoke={() => setRevoking(current)}
            />
          ) : (
            <p className="break-all rounded-lg border bg-muted/40 px-3 py-2 font-mono text-xs">{current.url}</p>
          )}
        </section>
      ) : (
        <div className="space-y-4 rounded-xl border border-dashed bg-card p-8 text-center">
          <p className="text-muted-foreground text-sm">
            El link activo se creó antes de que se guardara su QR, así que no se puede mostrar. Revocalo y creá uno
            nuevo.
          </p>
          {createButton}
        </div>
      )}

      {data.links.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-semibold text-sm">Todos los links</h3>
            {current?.url && createButton}
          </div>
          <ListTable>
            <TableHeader>
              <TableRow>
                <ListHead>Creado</ListHead>
                <ListHead>Estado</ListHead>
                {data.canManage && <ListHead>Acciones</ListHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.links.map((link) => (
                <TableRow key={link.id}>
                  <ListCell muted>{dateFormat.format(new Date(link.createdAt))}</ListCell>
                  <ListCell>
                    <Pill tone={link.status === "active" ? "green" : "neutral"}>
                      {link.status === "active" ? "Activo" : "Revocado"}
                    </Pill>
                    {link.revokedAt && (
                      <p className="mt-1 text-muted-foreground text-xs">
                        {dateFormat.format(new Date(link.revokedAt))}
                      </p>
                    )}
                  </ListCell>
                  {data.canManage && (
                    <ListCell>
                      {link.status === "active" && (
                        <Button variant="outline" className="h-9" onClick={() => setRevoking(link)}>
                          Revocar
                        </Button>
                      )}
                    </ListCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </ListTable>
        </section>
      )}

      <AlertDialog
        open={revoking !== null}
        onOpenChange={(next) => {
          if (!next && !busy) {
            setRevoking(null);
            setError(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Revocar este link?</AlertDialogTitle>
            <AlertDialogDescription>
              El link y su QR dejan de funcionar para {communityName}. No se puede deshacer: si hace falta, creá uno
              nuevo. Los otros links del consorcio siguen activos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {error && <p className="text-destructive text-sm">{error}</p>}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy}>Cancelar</AlertDialogCancel>
            <Button variant="destructive" disabled={busy} onClick={() => revoking && confirmRevoke(revoking)}>
              Revocar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
