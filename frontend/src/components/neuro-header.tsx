export default function NeuroHeader() {
  return (
    <header className="border-b border-border pb-6">
      <div className="flex items-start justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold tracking-wider text-phosphor-green">
              [AI]
            </span>

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-phosphor-green glow-text-green">
              NEUROLOG
            </h1>
          </div>

          <p className="text-sm md:text-base text-foreground/80">
            A diagnostic agent for runtime failures.
          </p>

          <p className="text-xs font-mono text-muted">
            Trace the failure. Understand the cause. Fix what comes next.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2 px-3 py-2 border border-border-bright text-xs font-mono text-phosphor-green">
          <span className="text-[9px] animate-pulse">●</span>
          <span>ENGINE ONLINE</span>
        </div>
      </div>
    </header>
  );
}
