export default function PlatformPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-6 py-16">
      <div className="max-w-xl space-y-4 text-center">
        <p className="text-muted-foreground text-sm uppercase tracking-[0.2em]">ELI Platform Admin</p>
        <h1 className="font-semibold text-3xl tracking-tight">Entorno de plataforma en preparación</h1>
        <p className="text-muted-foreground">
          Tu cuenta fue identificada como usuario de plataforma. Este destino existe para validar el routing de Auth V2
          mientras se implementa la experiencia completa de ELI Platform Admin.
        </p>
      </div>
    </main>
  );
}
