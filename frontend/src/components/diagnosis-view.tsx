import { TriageResponse } from "@/lib/types";

interface DiagnosisViewProps {
  result: TriageResponse;
  onReset: () => void;
}

export default function DiagnosisView({
  result,
  onReset,
}: DiagnosisViewProps) {
  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 border-b border-border pb-6">
        <div className="space-y-2">
          <p className="text-xs font-mono font-bold tracking-widest text-phosphor-green">
            DIAGNOSIS COMPLETE
          </p>

          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            NEUROLOG found the failure.
          </h2>

          <p className="max-w-2xl text-sm leading-6 text-muted">
            The agent traced the supplied runtime output to a specific failure
            point and generated a resolution path.
          </p>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="self-start sm:self-auto shrink-0 px-3 py-2 border border-border text-xs font-mono text-muted hover:text-phosphor-green hover:border-phosphor-green/40 transition-colors"
        >
          [ ANALYZE ANOTHER ]
        </button>
      </div>

      <section className="border border-border bg-panel rounded-lg overflow-hidden">
        <div className="px-5 py-3 border-b border-border flex items-center justify-between gap-4">
          <span className="text-xs font-mono font-bold tracking-wider text-phosphor-green">
            01 / WHAT BROKE
          </span>

          <span className="text-[10px] font-mono text-muted uppercase">
            {result.confidence} confidence
          </span>
        </div>

        <div className="p-5 md:p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
            <div className="min-w-0">
              <p className="text-2xl md:text-3xl font-bold tracking-tight text-foreground break-words">
                {result.error_type}
              </p>

              <p className="mt-3 max-w-3xl text-sm md:text-base leading-6 text-muted">
                {result.error_message}
              </p>
            </div>

            <div className="shrink-0">
              <p className="text-[10px] font-mono text-muted uppercase mb-2">
                Severity
              </p>

              <span className="inline-flex px-3 py-1.5 border border-phosphor-green/30 bg-phosphor-green/5 rounded text-xs font-bold font-mono text-phosphor-green">
                {result.severity}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="border border-border bg-panel rounded-lg overflow-hidden">
        <div className="px-5 py-3 border-b border-border">
          <span className="text-xs font-mono font-bold tracking-wider text-phosphor-green">
            02 / WHERE IT FAILED
          </span>
        </div>

        <div className="p-5 md:p-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-2 bg-black border border-border font-mono text-sm">
            <span className="text-foreground">
              {result.isolated_file}
            </span>

            <span className="text-muted">:</span>

            <span className="text-phosphor-green font-bold">
              {result.isolated_line}
            </span>
          </div>

          <p className="mt-3 text-xs text-muted">
            Isolated failure location identified by the diagnostic agent.
          </p>
        </div>
      </section>

      <section className="border border-phosphor-green/30 bg-panel rounded-lg overflow-hidden">
        <div className="px-5 py-3 border-b border-phosphor-green/20 flex items-center justify-between gap-4">
          <span className="text-xs font-mono font-bold tracking-wider text-phosphor-green">
            03 / HOW TO FIX IT
          </span>

          <span className="text-[10px] font-mono text-muted">
            RESOLUTION PLAYBOOK
          </span>
        </div>

        <div className="p-5 md:p-6 space-y-6">
          {result.playbook_steps.map((step) => (
            <div key={step.step_number} className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="shrink-0 text-xs font-mono font-bold text-phosphor-green pt-0.5">
                  {step.step_number.padStart(2, "0")}
                </span>

                <div>
                  <p className="font-bold text-foreground">
                    {step.title}
                  </p>

                  <p className="mt-1 text-xs text-muted">
                    {step.description}
                  </p>
                </div>
              </div>

              <pre className="p-4 md:ml-8 bg-black border border-border overflow-x-auto text-sm text-phosphor-green font-mono leading-6">
                {step.command}
              </pre>
            </div>
          ))}
        </div>
      </section>

      <section className="border border-border bg-panel rounded-lg overflow-hidden">
        <div className="px-5 py-3 border-b border-border">
          <span className="text-xs font-mono font-bold tracking-wider text-phosphor-green">
            04 / WHY IT FAILED
          </span>
        </div>

        <div className="p-5 md:p-6">
          <p className="max-w-4xl text-sm md:text-base leading-7 text-foreground">
            {result.root_cause}
          </p>
        </div>
      </section>

      <section className="border border-border bg-panel rounded-lg overflow-hidden">
        <div className="px-5 py-3 border-b border-border flex items-center justify-between gap-4">
          <span className="text-xs font-mono font-bold tracking-wider text-phosphor-green">
            05 / EVIDENCE
          </span>

          <span className="text-[10px] font-mono text-muted">
            ISOLATED CODE
          </span>
        </div>

        <pre className="p-5 md:p-6 overflow-x-auto text-sm text-foreground font-mono leading-6">
          {result.code_snippet.join("\n")}
        </pre>
      </section>
    </section>
  );
}
