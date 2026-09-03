export default function NeuroHeader() {
  return (
    <header className="border-b border-border pb-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-phosphor-green glow-text-green">
            [AI] NEUROLOG
          </h1>

          <p className="text-muted text-sm mt-1">
            A diagnostic agent for runtime failures.
          </p>
        </div>

        <div className="text-xs text-phosphor-green">
          ● ENGINE ONLINE
        </div>
      </div>
    </header>
  );
}