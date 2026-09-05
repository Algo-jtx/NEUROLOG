"use client";

import { useEffect, useState } from "react";

const steps = [
  "Inspecting runtime output",
  "Locating failure",
  "Building diagnosis",
  "Preparing resolution",
];

export default function AnalyzingState() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((current) => Math.min(current + 1, steps.length - 1));
    }, 450);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="border border-border bg-panel rounded-lg overflow-hidden">
      <div className="px-5 py-3 border-b border-border">
        <span className="text-xs font-mono font-bold tracking-wider text-phosphor-green">
          ANALYSIS IN PROGRESS
        </span>
      </div>

      <div className="p-6 md:p-8">
        <div className="space-y-7">
          <div>
            <p className="text-xl md:text-2xl font-bold text-foreground">
              NEUROLOG is tracing the failure...
            </p>

            <p className="mt-2 text-sm text-muted">
              Inspecting the supplied runtime output and building a diagnosis.
            </p>
          </div>

          <div className="space-y-4 font-mono text-sm">
            {steps.map((step, index) => {
              const isActive = index === activeStep;
              const isComplete = index < activeStep;

              return (
                <div
                  key={step}
                  className="flex items-center gap-3 transition-opacity duration-300"
                >
                  <span
                    className={
                      isActive || isComplete
                        ? "text-phosphor-green"
                        : "text-muted"
                    }
                  >
                    [{String(index + 1).padStart(2, "0")}]
                  </span>

                  <span
                    className={
                      isActive
                        ? "text-foreground"
                        : isComplete
                        ? "text-muted"
                        : "text-muted/60"
                    }
                  >
                    {step}
                  </span>

                  {isActive && (
                    <span className="ml-auto text-xs text-phosphor-green animate-pulse">
                      ACTIVE
                    </span>
                  )}

                  {isComplete && (
                    <span className="ml-auto text-xs text-phosphor-green">
                      DONE
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-2">
            <div className="h-px w-full bg-border overflow-hidden">
              <div className="h-full w-1/3 bg-phosphor-green animate-pulse" />
            </div>

            <p className="mt-3 text-[10px] font-mono text-muted">
              AGENT STATUS // TRACING
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
