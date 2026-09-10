export interface PlaybookStep {
  step_number: string;
  title: string;
  command: string;
  description: string;
}

export interface TriageResponse {
  severity: string;
  error_type: string;
  error_message: string;
  confidence: string;
  isolated_file: string;
  isolated_line: number;
  code_snippet: string[];
  root_cause: string;
  playbook_steps: PlaybookStep[];
}

export interface TriageRequest {
  raw_log: string;
  runtime_env?: string;
}