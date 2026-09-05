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
    <section className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-mono text-phosphor-green">
            INPUT STREAM
          </p>

          <h2 className="mt-1 text-xl md:text-2xl font-bold text-foreground">
            Feed the failure to NEUROLOG.
          </h2>

          <p className="mt-1 text-sm text-muted">
            Paste the runtime output you want the agent to investigate.
          </p>
        </div>

        <span className="shrink-0 text-xs font-mono text-muted">
          {value.length} chars
        </span>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="relative border border-border bg-panel rounded-lg overflow-hidden focus-within:border-phosphor-green/60 transition-colors">
          <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-black/30">
            <span className="text-xs font-mono text-muted">
              &gt;_ RUNTIME LOG
            </span>

            <span className="text-[10px] font-mono text-muted/60">
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
            className="w-full bg-transparent p-5 font-mono text-sm leading-6 text-foreground placeholder:text-muted/35 focus:outline-none resize-none"
          />

          <div className="px-4 py-2 border-t border-border bg-black/20">
            <span className="text-[10px] font-mono text-muted/60">
              READY FOR DIAGNOSIS
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="max-w-xl text-xs leading-5 text-muted">
            NEUROLOG will trace the failure, isolate where it occurred,
            explain the root cause, and build a resolution playbook.
          </p>

          <button
            type="submit"
            disabled={loading || !value.trim()}
            className="shrink-0 px-6 py-3 bg-phosphor-green text-black font-bold text-sm rounded-md hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          >
            {loading ? "ANALYZING..." : "DIAGNOSE FAILURE"}
          </button>
        </div>
      </form>
    </section>
  );
}
