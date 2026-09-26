import { getAuthContext } from "@/lib/auth/get-auth-context";
import { createClient } from "@/lib/supabase/server";
import { getDeskFeatureAccess } from "@/server/access/resolve-desk-feature-access";
import { type CommunitySummary, listCommunities } from "@/server/communities/community-repository";

import { CommunitiesList } from "./_components/communities-list";

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

async function loadCommunities(): Promise<CommunitySummary[] | null> {
  try {
    const access = await getDeskFeatureAccess("consorcios");
    if (access?.consorcioScope == null) return null;
    const supabase = await createClient();
    const context = await getAuthContext(supabase);
    if (!context.authenticated || context.userType !== "tenant" || !context.organizationId) return null;
    return await listCommunities(supabase, context.organizationId, access.consorcioScope);
  } catch {
    return null;
  }
}

export default async function ConsorciosPage() {
  const access = await getDeskFeatureAccess("consorcios");
  if (access?.state !== "resolved") {
    return <MessageState title="Sin acceso" body="No se puede mostrar el módulo con el acceso actual." />;
  }

  const communities = await loadCommunities();
  if (communities === null) {
    return <MessageState title="No se pudieron cargar los consorcios" body="Probá de nuevo en unos minutos." />;
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="font-medium text-muted-foreground text-sm">Administración</p>
        <h1 className="font-semibold text-3xl tracking-tight">Consorcios</h1>
        <p className="mt-1 text-muted-foreground">Consorcios que tenés a cargo, con sus unidades y tickets activos.</p>
      </header>

      <CommunitiesList communities={communities} />
    </div>
  );
}
