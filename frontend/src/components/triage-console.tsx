"use client";

import React, { useState } from "react";
import { processLogTriage } from "@/lib/api";
import { TriageResponse } from "@/lib/types";

export default function TriageConsole() {
  const [logInput, setLogInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TriageResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!logInput.trim()) {
      setError("Please paste a log or stack trace before running analysis.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await processLogTriage({
        raw_log: logInput,
      });

      setResult(data);
    } catch (err: any) {
      setError(err.message || "Unable to connect to the triage engine.");
    } finally {
      setLoading(false);
    }
  };

  const severityClass = (severity: string) => {
    const value = severity.toLowerCase();

    if (value.includes("critical") || value.includes("fatal")) {
      return "border-red-500/50 bg-red-950/20 text-red-400";
    }

    if (value.includes("high")) {
      return "border-orange-500/50 bg-orange-950/20 text-orange-400";
    }

    if (value.includes("medium") || value.includes("warning")) {
      return "border-yellow-500/50 bg-yellow-950/20 text-yellow-400";
    }

    return "border-phosphor-green/40 bg-green-950/20 text-phosphor-green";
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* HEADER */}
      <header className="border-b border-border pb-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-phosphor-green text-sm">[AI]</span>

              <h1 className="text-2xl font-bold tracking-wide text-phosphor-green glow-text-green">
                NEURAL LOG
              </h1>
            </div>

            <p className="mt-2 text-sm text-muted">
              AI-powered runtime error analysis and resolution console.
            </p>
          </div>

          <div className="flex items-center gap-2 border border-phosphor-green/30 bg-black/40 px-3 py-2 text-xs text-phosphor-green">
            <span className="h-2 w-2 animate-pulse rounded-full bg-phosphor-green" />
            ENGINE ONLINE
          </div>
        </div>
      </header>

      {/* INPUT CONSOLE */}
      <section className="border border-border bg-panel/80">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-bold text-phosphor-green">
            <span>&gt;_</span>
            LOG INPUT
          </div>

          <span className="text-xs text-muted">
            {logInput.length} characters
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          <textarea
            value={logInput}
            onChange={(e) => setLogInput(e.target.value)}
            placeholder={`Paste your stack trace or runtime logs here...

Example:
Traceback (most recent call last):
  File "app.py", line 10, in <module>
    result = 10 / 0
ZeroDivisionError: division by zero`}
            rows={12}
            spellCheck={false}
            className="w-full resize-y border-0 bg-black/60 p-4 font-mono text-sm leading-6 text-foreground placeholder:text-muted/40 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-phosphor-green/50"
          />

          <div className="flex flex-col gap-3 border-t border-border p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted">
              Submit raw logs for AI-powered triage.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="border border-phosphor-green bg-phosphor-green px-5 py-2.5 font-mono text-sm font-bold text-black transition-all hover:bg-transparent hover:text-phosphor-green disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "[ ANALYZING... ]" : "[ RUN TRIAGE ]"}
            </button>
          </div>
        </form>
      </section>

      {/* ERROR */}
      {error && (
        <section className="border border-red-500/50 bg-red-950/20 p-4 text-sm text-red-400 glow-border-red">
          <div className="mb-1 font-bold">! TRIAGE ENGINE ERROR</div>
          <div>{error}</div>
        </section>
      )}

      {/* LOADING */}
      {loading && (
        <section className="border border-phosphor-green/20 bg-panel/60 p-6">
          <div className="font-mono text-sm text-phosphor-green">
            <span className="animate-pulse">&gt; Neural Log is analyzing log stream...</span>
          </div>

          <div className="mt-4 h-1 overflow-hidden bg-black">
            <div className="h-full w-1/2 animate-pulse bg-phosphor-green" />
          </div>
        </section>
      )}

      {/* RESULTS */}
      {result && !loading && (
        <section className="space-y-5">
          {/* RESULT HEADER */}
          <div className="flex flex-col gap-3 border-b border-border pb-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-xs uppercase tracking-widest text-muted">
                Analysis complete
              </div>

              <h2 className="mt-1 text-lg font-bold text-phosphor-green">
                TRIAGE RESULT
              </h2>
            </div>

            <div className="text-xs text-muted">
              AI diagnostic response received
            </div>
          </div>

          {/* SUMMARY */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="border border-border bg-panel p-4">
              <div className="text-xs uppercase tracking-wider text-muted">
                Severity
              </div>

              <div
                className={`mt-3 inline-flex border px-3 py-1.5 text-sm font-bold uppercase ${severityClass(
                  result.severity
                )}`}
              >
                {result.severity}
              </div>
            </div>

            <div className="border border-border bg-panel p-4">
              <div className="text-xs uppercase tracking-wider text-muted">
                Error Type
              </div>

              <div className="mt-3 break-words font-mono text-sm font-bold text-foreground">
                {result.error_type}
              </div>
            </div>

            <div className="border border-border bg-panel p-4">
              <div className="text-xs uppercase tracking-wider text-muted">
                AI Confidence
              </div>

              <div className="mt-3 font-mono text-sm font-bold text-phosphor-green">
                {result.confidence}
              </div>
            </div>
          </div>

          {/* ERROR MESSAGE */}
          <div className="border border-border bg-panel">
            <div className="border-b border-border px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted">
              Error Message
            </div>

            <div className="p-4 font-mono text-sm text-red-300">
              {result.error_message}
            </div>
          </div>

          {/* ISOLATED FAILURE */}
          <div className="border border-border bg-panel">
            <div className="border-b border-border px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted">
              Isolated Failure
            </div>

            <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-6">
              <div>
                <div className="text-xs text-muted">FILE</div>
                <div className="mt-1 font-mono text-sm text-phosphor-green">
                  {result.isolated_file}
                </div>
              </div>

              <div className="hidden text-border sm:block">/</div>

              <div>
                <div className="text-xs text-muted">LINE</div>
                <div className="mt-1 font-mono text-sm text-phosphor-green">
                  {result.isolated_line}
                </div>
              </div>
            </div>
          </div>

          {/* CODE SNIPPET */}
          <div className="border border-border bg-black">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="text-xs font-bold uppercase tracking-wider text-muted">
                Code Snippet
              </span>

              <span className="text-xs text-muted">
                {result.isolated_file}:{result.isolated_line}
              </span>
            </div>

            <div className="overflow-x-auto p-4">
              <pre className="font-mono text-sm leading-7">
                {result.code_snippet.map((line, index) => (
                  <div key={index} className="flex">
                    <span className="mr-4 w-6 select-none text-right text-muted/40">
                      {index + 1}
                    </span>

                    <code
                      className={
                        line.includes("result =")
                          ? "text-red-300"
                          : "text-foreground"
                      }
                    >
                      {line}
                    </code>
                  </div>
                ))}
              </pre>
            </div>
          </div>

          {/* ROOT CAUSE */}
          <div className="border border-border bg-panel">
            <div className="border-b border-border px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted">
              Root Cause
            </div>

            <p className="p-4 text-sm leading-7 text-foreground">
              {result.root_cause}
            </p>
          </div>

          {/* PLAYBOOK */}
          <div className="border border-border bg-panel">
            <div className="border-b border-border px-4 py-3">
              <div className="text-xs font-bold uppercase tracking-wider text-muted">
                Resolution Playbook
              </div>

              <div className="mt-1 text-xs text-muted/70">
                AI-generated remediation steps
              </div>
            </div>

            <div className="divide-y divide-border">
              {result.playbook_steps.map((step, index) => (
                <div key={index} className="p-5">
                  <div className="flex gap-4">
                    <div className="flex h-7 min-w-7 items-center justify-center border border-phosphor-green/30 text-xs font-bold text-phosphor-green">
                      {step.step_number}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-phosphor-green">
                        {step.title}
                      </h3>

                      <div className="mt-3 overflow-x-auto border border-border bg-black p-3">
                        <code className="font-mono text-sm text-green-300">
                          $ {step.command}
                        </code>
                      </div>

                      <p className="mt-3 text-sm leading-6 text-muted">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* EMPTY STATE */}
      {!result && !loading && !error && (
        <div className="py-8 text-center text-xs text-muted/60">
          <span className="text-phosphor-green/50">&gt;</span>{" "}
          Awaiting log stream for analysis...
        </div>
      )}
    </div>
  );
}