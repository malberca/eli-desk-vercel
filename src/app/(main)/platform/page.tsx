export default function PlatformPage() {
  return (
    <section className="flex min-h-[calc(100dvh-8rem)] items-center justify-center rounded-[2rem] border border-border/70 bg-card px-6 py-16 shadow-sm">
      <div className="max-w-xl space-y-4 text-center">
        <p className="text-muted-foreground text-sm uppercase tracking-[0.2em]">ELI Platform Admin</p>
        <h1 className="font-semibold text-3xl tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          El shell inicial de administración global está listo para evolucionar con los módulos de plataforma aprobados.
        </p>
      </div>
    </section>
  );
}
