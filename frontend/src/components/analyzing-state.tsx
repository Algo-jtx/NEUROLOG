"use client";

export default function AnalyzingState() {
  return (
    <section className="border border-phosphor-green/30 bg-panel rounded-lg overflow-hidden">
      <div className="px-5 py-3 border-b border-phosphor-green/20 flex items-center justify-between">
        <span className="text-xs font-mono font-bold tracking-widest text-phosphor-green crt-shimmer">
          DIAGNOSTIC SIGNAL
        </span>

        <span className="text-[10px] font-mono font-bold tracking-wider text-phosphor-green">
          ACTIVE
        </span>
      </div>

      <div className="px-6 md:px-8 py-10 md:py-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-7">
            <span className="text-phosphor-green font-mono text-xs crt-shimmer">
              &gt;_
            </span>

            <span className="text-xs font-mono font-bold tracking-widest text-muted">
              RUNTIME SIGNAL
            </span>
          </div>

          <div className="crt-wave" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>

          <h2 className="mt-8 text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Tracing the failure path.
          </h2>

          <p className="mt-3 text-sm md:text-base font-medium leading-7 text-foreground/75">
            Following the runtime signal toward the source of the failure.
          </p>

          <div className="mt-8 flex items-center gap-3 font-mono text-xs">
            <span className="text-phosphor-green animate-pulse">●</span>
            <span className="text-muted">
              NEUROLOG // SIGNAL ACTIVE
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
