"use client";

import React, { useState } from "react";
import { processLogTriage } from "@/lib/api";
import { TriageResponse } from "@/lib/types";

type ConsoleState = "input" | "analyzing" | "result";

export default function TriageConsole() {
  const [logInput, setLogInput] = useState("");
  const [state, setState] = useState<ConsoleState>("input");
  const [result, setResult] = useState<TriageResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!logInput.trim()) return;

    setError(null);
    setState("analyzing");

    try {
      const data = await processLogTriage({
        raw_log: logInput,
      });

      setResult(data);
      setState("result");
    } catch (err: any) {
      setError(err.message || "Unable to complete the diagnosis.");
      setState("input");
    }
  };

  const resetConsole = () => {
    setLogInput("");
    setResult(null);
    setError(null);
    setState("input");
  };

  const severity = result?.severity?.toLowerCase() || "";

  return (
    <div className="neurolog-shell">
      {/* HEADER */}
      <header className="neurolog-header">
        <div>
          <div className="brand-line">
            <span className="brand-prefix">[AI]</span>
            <h1>NEUROLOG</h1>
          </div>

          <p className="brand-description">
            Diagnostic intelligence for runtime failures.
          </p>
        </div>

        <div className="engine-status">
          <span className="status-dot" />
          ENGINE ONLINE
        </div>
      </header>

      {/* INPUT STATE */}
      {state === "input" && (
        <section className="console-panel">
          <div className="panel-heading">
            <span className="prompt-symbol">&gt;_</span>
            <span>LOG INPUT</span>

            <span className="character-count">
              {logInput.length} characters
            </span>
          </div>

          <form onSubmit={handleSubmit}>
            <textarea
              value={logInput}
              onChange={(e) => setLogInput(e.target.value)}
              placeholder={`Paste a runtime error, stack trace, or console log here...

Neurolog will trace the failure, identify where it occurred,
explain why it happened, and recommend what to do next.`}
              spellCheck={false}
              className="log-editor"
            />

            <div className="console-actions">
              <span className="input-hint">
                Submit a failure for diagnosis.
              </span>

              <button
                type="submit"
                disabled={!logInput.trim()}
                className="primary-button"
              >
                [ DIAGNOSE ]
              </button>
            </div>
          </form>

          {error && (
            <div className="error-panel">
              <div className="error-title">! DIAGNOSIS FAILED</div>
              <p>{error}</p>
            </div>
          )}
        </section>
      )}

      {/* ANALYZING STATE */}
      {state === "analyzing" && (
        <section className="analysis-state">
          <div className="analysis-header">
            <span className="analysis-prompt">&gt;</span>
            <span>NEUROLOG IS ANALYZING THE FAILURE...</span>
          </div>

          <div className="analysis-details">
            <div>&gt; reading log stream</div>
            <div>&gt; tracing failure location</div>
            <div>&gt; identifying root cause</div>
            <div>&gt; generating resolution steps</div>
          </div>

          <div className="loading-track">
            <div className="loading-bar" />
          </div>

          <div className="analysis-footer">
            <span>PROCESSING</span>
            <span>PLEASE WAIT</span>
          </div>
        </section>
      )}

      {/* RESULT STATE */}
      {state === "result" && result && (
        <section className="diagnosis">

          {/* RESULT HEADER */}
          <div className="diagnosis-header">
            <div>
              <div className="eyebrow">DIAGNOSIS READY</div>

              <h2>NEUROLOG FOUND THE FAILURE</h2>

              <p>
                The failure has been isolated and a recommended resolution
                has been generated.
              </p>
            </div>

            <button
              type="button"
              onClick={resetConsole}
              className="secondary-button"
            >
              [ ANALYZE ANOTHER ]
            </button>
          </div>

          {/* PRIMARY DIAGNOSIS */}
          <div className="diagnosis-summary">
            <div className="summary-severity">
              <span className="field-label">SEVERITY</span>

              <span
                className={`severity-badge ${
                  severity === "critical"
                    ? "severity-critical"
                    : severity === "high"
                    ? "severity-high"
                    : "severity-normal"
                }`}
              >
                {result.severity}
              </span>
            </div>

            <div className="summary-main">
              <span className="field-label">FAILURE</span>
              <h3>{result.error_type}</h3>
              <p>{result.error_message}</p>
            </div>

            <div className="summary-confidence">
              <span className="field-label">CONFIDENCE</span>
              <strong>{result.confidence}</strong>
            </div>
          </div>

          {/* FAILURE + RESOLUTION */}
          <div className="diagnosis-grid">

            {/* WHERE */}
            <section className="diagnosis-card">
              <div className="card-heading">
                <span>01</span>
                <h3>WHERE IT FAILED</h3>
              </div>

              <div className="failure-location">
                <div>
                  <span className="field-label">FILE</span>
                  <strong>{result.isolated_file}</strong>
                </div>

                <div>
                  <span className="field-label">LINE</span>
                  <strong>{result.isolated_line}</strong>
                </div>
              </div>

              <details className="technical-details">
                <summary>VIEW RELEVANT CODE</summary>

                <div className="code-block">
                  {result.code_snippet.map((line, index) => (
                    <div className="code-line" key={index}>
                      <span className="line-number">{index + 1}</span>
                      <code>{line}</code>
                    </div>
                  ))}
                </div>
              </details>
            </section>

            {/* HOW */}
            <section className="diagnosis-card resolution-card">
              <div className="card-heading">
                <span>02</span>
                <h3>HOW TO FIX IT</h3>
              </div>

              <div className="playbook">
                {result.playbook_steps.map((step) => (
                  <div className="playbook-step" key={step.step_number}>
                    <div className="step-number">
                      {step.step_number}
                    </div>

                    <div className="step-content">
                      <h4>{step.title}</h4>

                      <div className="command-block">
                        <span>$</span>
                        <code>{step.command}</code>
                      </div>

                      <p>{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* ROOT CAUSE */}
          <section className="root-cause-card">
            <div className="card-heading">
              <span>03</span>
              <h3>WHY IT FAILED</h3>
            </div>

            <p>{result.root_cause}</p>
          </section>

          {/* TECHNICAL DETAILS */}
          <details className="full-log-details">
            <summary>VIEW ORIGINAL ERROR</summary>

            <pre>{result.error_message}</pre>
          </details>
        </section>
      )}
    </div>
  );
}