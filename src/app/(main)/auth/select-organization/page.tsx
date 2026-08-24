import { logoutAction } from "@/server/server-actions";

export default function SelectOrganizationPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-6 py-16">
      <div className="max-w-xl space-y-4 text-center">
        <p className="text-muted-foreground text-sm uppercase tracking-[0.2em]">Seleccion de organizacion</p>
        <h1 className="font-semibold text-3xl tracking-tight">Necesitas elegir una organizacion</h1>
        <p className="text-muted-foreground">
          Tu cuenta tiene acceso a mas de una organizacion. Este flujo queda reservado para la seleccion explicita de
          organizacion en una tarea posterior.
        </p>
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
