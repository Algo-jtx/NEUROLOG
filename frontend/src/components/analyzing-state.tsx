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
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-bold text-phosphor-green">
            &gt;_ LOG INPUT
          </label>

          <span className="text-xs text-muted">
            {value.length} characters
          </span>
        </div>

        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Paste a runtime error, stack trace, or console log here..."
          rows={10}
          className="w-full bg-panel border border-border rounded-lg p-4 font-mono text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-phosphor-green transition-colors resize-none"
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-muted">
          NEUROLOG will trace the failure, identify where it occurred,
          explain why, and recommend what to do next.
        </p>

        <button
          type="submit"
          disabled={loading || !value.trim()}
          className="shrink-0 px-5 py-2.5 bg-phosphor-green text-black font-bold text-sm rounded-md hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {loading ? "Analyzing..." : "Diagnose"}
        </button>
      </div>
    </form>
  );
}