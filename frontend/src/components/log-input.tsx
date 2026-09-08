"use client";

import React from "react";

interface LogInputProps {
  value: string;
  loading: boolean;
  onChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
}

export default function LogInput({
  value,
  loading,
  onChange,
  onSubmit,
}: LogInputProps) {
  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-mono font-bold tracking-widest text-phosphor-green crt-shimmer">
            INPUT STREAM
          </p>

          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Feed the failure to NEUROLOG.
          </h2>

          <p className="max-w-2xl text-sm md:text-base font-medium leading-6 text-foreground/75">
            Drop the runtime output below. NEUROLOG will isolate the break,
            trace its source, and surface the next move.
          </p>
        </div>

        <span className="shrink-0 text-xs font-mono text-muted">
          {value.length} chars
        </span>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="relative border border-border bg-panel rounded-lg overflow-hidden focus-within:border-phosphor-green/60 transition-colors">
          <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-black/30">
            <span className="text-xs font-mono font-bold text-muted">
              &gt;_ RUNTIME LOG
            </span>

            <span className="text-[10px] font-mono text-muted/70">
              STDIN
            </span>
          </div>

          <textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={`Paste a runtime error, stack trace, or console log here...

Example:
Traceback (most recent call last):
  File "app.py", line 10, in <module>
    result = 10 / 0
ZeroDivisionError: division by zero`}
            rows={12}
            spellCheck={false}
            className="log-editor"
          />

          <div className="px-4 py-2 border-t border-border bg-black/20">
            <span className="text-[10px] font-mono font-bold tracking-wider text-muted/70">
              READY FOR DIAGNOSIS
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <p className="max-w-2xl text-sm font-medium leading-6 text-foreground/70">
            Runtime signal in. Failure path out. NEUROLOG turns raw output
            into a clear diagnosis and an actionable resolution path.
          </p>

          <button
            type="submit"
            disabled={loading || !value.trim()}
            className="shrink-0 px-6 py-3 bg-phosphor-green text-black font-bold text-sm rounded-md hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          >
            DIAGNOSE FAILURE
          </button>
        </div>
      </form>
    </section>
  );
}
