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
    <section className="space-y-5">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <p className="text-xs text-muted">DIAGNOSIS READY</p>

          <h2 className="text-xl font-bold text-phosphor-green glow-text-green mt-1">
            NEUROLOG FOUND THE FAILURE
          </h2>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="text-xs text-muted hover:text-phosphor-green transition-colors"
        >
          [ ANALYZE ANOTHER ]
        </button>
      </div>

      <div className="border border-border bg-panel rounded-lg p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-muted">SEVERITY</p>
            <p className="font-bold text-phosphor-green mt-1">
              {result.severity}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted">FAILURE</p>
            <p className="font-bold text-foreground mt-1">
              {result.error_type}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted">CONFIDENCE</p>
            <p className="font-bold text-phosphor-green mt-1">
              {result.confidence}
            </p>
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <p className="text-xs text-muted">WHAT HAPPENED</p>
          <p className="text-foreground mt-2">
            {result.error_message}
          </p>
        </div>
      </div>

      <div className="border border-border bg-panel rounded-lg p-5">
        <p className="text-xs text-muted">WHERE IT FAILED</p>

        <p className="text-foreground mt-2 font-bold">
          {result.isolated_file}
          <span className="text-muted"> : </span>
          {result.isolated_line}
        </p>
      </div>

      <div className="border border-border bg-panel rounded-lg p-5">
        <p className="text-xs text-muted">WHY IT FAILED</p>

        <p className="text-foreground mt-2">
          {result.root_cause}
        </p>
      </div>

      <div className="border border-border bg-panel rounded-lg p-5">
        <p className="text-xs text-muted mb-3">CODE</p>

        <pre className="overflow-x-auto text-sm text-foreground font-mono">
          {result.code_snippet.join("\n")}
        </pre>
      </div>

      <div className="border border-phosphor-green/30 bg-panel rounded-lg p-5">
        <p className="text-xs text-phosphor-green font-bold">
          HOW TO FIX IT
        </p>

        <div className="mt-4 space-y-4">
          {result.playbook_steps.map((step) => (
            <div key={step.step_number}>
              <p className="font-bold text-foreground">
                {step.step_number}. {step.title}
              </p>

              <pre className="mt-2 p-3 bg-black border border-border overflow-x-auto text-sm text-phosphor-green font-mono">
                {step.command}
              </pre>

              <p className="text-sm text-muted mt-2">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}