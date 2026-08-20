export default function AuthUnresolvedPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-6 py-16">
      <div className="max-w-xl space-y-4 text-center">
        <p className="text-muted-foreground text-sm uppercase tracking-[0.2em]">Cuenta autenticada</p>
        <h1 className="font-semibold text-3xl tracking-tight">Acceso interno no disponible</h1>
        <p className="text-muted-foreground">
          Tu identidad fue validada correctamente, pero no encontramos una configuracion interna habilitada para acceder
          a ELI en este entorno.
        </p>
      </div>
    </main>
  );
}
