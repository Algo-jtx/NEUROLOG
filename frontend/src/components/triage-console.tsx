"use client";

import React, { useState } from "react";
import { processLogTriage } from "@/lib/api";
import { TriageResponse } from "@/lib/types";

import NeuroHeader from "@/components/neuro-header";
import LogInput from "@/components/log-input";
import AnalyzingState from "@/components/analyzing-state";
import DiagnosisView from "@/components/diagnosis-view";

type ConsoleState = "ready" | "analyzing" | "diagnosis";

const MIN_ANALYSIS_TIME = 1800;

export default function TriageConsole() {
  const [logInput, setLogInput] = useState("");
  const [status, setStatus] = useState<ConsoleState>("ready");
  const [result, setResult] = useState<TriageResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!logInput.trim()) return;

    setStatus("analyzing");
    setError(null);

    const analysisDelay = new Promise<void>((resolve) => {
      setTimeout(resolve, MIN_ANALYSIS_TIME);
    });

    try {
      const data = await processLogTriage({
        raw_log: logInput,
      });

      await analysisDelay;

      setResult(data);
      setStatus("diagnosis");
    } catch (err: any) {
      await analysisDelay;

      setError(err.message || "Failed to analyze the log.");
      setStatus("ready");
    }
  };

  const handleReset = () => {
    setLogInput("");
    setResult(null);
    setError(null);
    setStatus("ready");
  };

  return (
    <div className="max-w-6xl mx-auto px-5 py-8 md:px-8 md:py-10 space-y-10">
      <NeuroHeader />

      {status === "ready" && (
        <LogInput
          value={logInput}
          loading={false}
          onChange={setLogInput}
          onSubmit={handleSubmit}
        />
      )}

      {status === "analyzing" && <AnalyzingState />}

      {status === "diagnosis" && result && (
        <DiagnosisView
          result={result}
          onReset={handleReset}
        />
      )}

      {error && (
        <div className="p-4 rounded-lg border border-red-500/50 bg-red-950/20 text-red-400 text-sm">
          <span className="font-bold">TRIAGE ENGINE ERROR</span>
          <p className="mt-1">{error}</p>
        </div>
      )}
    </div>
  );
}
