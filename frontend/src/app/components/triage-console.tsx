import { TriageRequest, TriageResponse } from "./types";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function processLogTriage(payload: TriageRequest): Promise<TriageResponse> {
  const response = await fetch(`${BACKEND_URL}/api/triage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to process log triage stream.");
  }

  return response.json();
}