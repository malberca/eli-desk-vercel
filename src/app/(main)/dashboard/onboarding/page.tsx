import { getAuthContext } from "@/lib/auth/get-auth-context";
import { createClient } from "@/lib/supabase/server";
import { getDeskFeatureAccess } from "@/server/access/resolve-desk-feature-access";
import { listOnboardingRequests, type OnboardingRequest } from "@/server/onboarding/onboarding-repository";

import { OnboardingRequestsList } from "./_components/onboarding-requests-list";

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

// Onboarding requests add residents, so they follow the residentes access and consorcio scope.
async function loadRequests(): Promise<OnboardingRequest[] | null> {
  try {
    const access = await getDeskFeatureAccess("residentes");
    if (access?.consorcioScope == null) return null;
    const supabase = await createClient();
    const context = await getAuthContext(supabase);
    if (!context.authenticated || context.userType !== "tenant" || !context.organizationId) return null;
    return await listOnboardingRequests(supabase, context.organizationId, access.consorcioScope);
  } catch {
    return null;
  }
}

export default async function OnboardingPage() {
  const access = await getDeskFeatureAccess("residentes");
  if (access?.state !== "resolved") {
    return <MessageState title="Sin acceso" body="No se puede mostrar el módulo con el acceso actual." />;
  }

  const requests = await loadRequests();
  if (requests === null) {
    return <MessageState title="No se pudieron cargar las solicitudes" body="Probá de nuevo en unos minutos." />;
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="font-medium text-muted-foreground text-sm">Administración</p>
        <h1 className="font-semibold text-3xl tracking-tight">Onboarding</h1>
        <p className="mt-1 text-muted-foreground">Solicitudes de alta de residentes en tus consorcios.</p>
      </header>

      <OnboardingRequestsList requests={requests} />
    </div>
  );
}
