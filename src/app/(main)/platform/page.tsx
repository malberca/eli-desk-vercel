import { createClient } from "@/lib/supabase/server";
import { logoutAction } from "@/server/server-actions";

export default async function PlatformPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const email = user?.email ?? "";
  const fullName = typeof user?.user_metadata?.full_name === "string" ? user.user_metadata.full_name.trim() : "";
  const name = typeof user?.user_metadata?.name === "string" ? user.user_metadata.name.trim() : "";
  const displayName = fullName || name || email;

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-6 py-16">
      <div className="max-w-xl space-y-4 text-center">
        <p className="text-muted-foreground text-sm uppercase tracking-[0.2em]">ELI Platform Admin</p>
        <h1 className="font-semibold text-3xl tracking-tight">Entorno de plataforma en preparación</h1>
        <p className="text-muted-foreground">
          Tu cuenta fue identificada como usuario de plataforma. Este destino existe para validar el routing de Auth V2
          mientras se implementa la experiencia completa de ELI Platform Admin.
        </p>
        <div className="rounded-lg border border-border/70 bg-muted/30 px-4 py-3 text-left">
          <p className="font-medium text-sm">{displayName}</p>
          <p className="text-muted-foreground text-sm">{email}</p>
        </div>
        <form action={logoutAction} className="pt-2">
          <button
            type="submit"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm shadow-xs transition-colors hover:bg-primary/90"
          >
            Cerrar sesión
          </button>
        </form>
      </div>
    </main>
  );
}
